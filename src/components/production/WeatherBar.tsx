import { useEffect, useState } from "react";

/** WMO weather codes → short English labels. */
const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm, hail",
  99: "Thunderstorm, hail",
};

interface DayForecast {
  max: number;
  min: number;
  rain: number | null;
  sunrise: string;
  sunset: string;
}

interface WeatherData {
  place: string;
  temp: number;
  code: number;
  today: DayForecast;
  tomorrow: DayForecast | null;
}

const CACHE_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; data: WeatherData }>();

const UNIT_KEY = "fg-weather-unit";

const readUnit = (): "c" | "f" => {
  try {
    return localStorage.getItem(UNIT_KEY) === "f" ? "f" : "c";
  } catch {
    return "c";
  }
};

const writeUnit = (u: "c" | "f") => {
  try {
    localStorage.setItem(UNIT_KEY, u);
  } catch {
    /* ignore */
  }
};

/** ISO timestamp from Open-Meteo is already in the location's local time. */
const clock = (iso: string) => (iso || "").slice(11, 16);

async function fetchWeather(location: string): Promise<WeatherData> {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
  );
  if (!geoRes.ok) throw new Error("geocode failed");
  const geo = await geoRes.json();
  const hit = geo?.results?.[0];
  if (!hit) throw new Error("location not found");

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
      `&timezone=auto&forecast_days=2`,
  );
  if (!res.ok) throw new Error("forecast failed");
  const json = await res.json();
  const d = json?.daily;
  if (!json?.current || !d) throw new Error("no forecast");

  const day = (i: number): DayForecast => ({
    max: Math.round(d.temperature_2m_max[i]),
    min: Math.round(d.temperature_2m_min[i]),
    rain: d.precipitation_probability_max?.[i] ?? null,
    sunrise: d.sunrise?.[i] || "",
    sunset: d.sunset?.[i] || "",
  });

  return {
    place: [hit.name, hit.country].filter(Boolean).join(", "),
    temp: Math.round(json.current.temperature_2m),
    code: json.current.weather_code,
    today: day(0),
    tomorrow: d.time?.length > 1 ? day(1) : null,
  };
}

const WeatherBar = ({ location }: { location: string }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"c" | "f">(readUnit);
  const [showTomorrow, setShowTomorrow] = useState(false);

  useEffect(() => {
    const key = location.trim().toLowerCase();
    if (!key) return;
    let live = true;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_MS) {
      setData(cached.data);
      setFailed(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    fetchWeather(location.trim())
      .then((d) => {
        cache.set(key, { at: Date.now(), data: d });
        if (live) setData(d);
      })
      .catch(() => {
        if (live) {
          setData(null);
          setFailed(true);
        }
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [location]);

  const deg = (c: number) => (unit === "c" ? `${c}°C` : `${Math.round(c * 9 / 5 + 32)}°F`);
  const degShort = (c: number) => (unit === "c" ? `${c}°` : `${Math.round(c * 9 / 5 + 32)}°`);

  const wrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    fontSize: 13.5,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.6,
  };

  if (!location.trim()) return null;
  if (loading && !data) return <div style={wrap}>Loading weather…</div>;
  if (failed || !data) return <div style={wrap}>Weather unavailable</div>;

  const shown = showTomorrow && data.tomorrow ? data.tomorrow : data.today;

  const parts = [
    data.place,
    !showTomorrow ? deg(data.temp) : null,
    WMO[data.code] ?? "—",
    `↑${degShort(shown.max)} ↓${degShort(shown.min)}`,
    shown.rain != null ? `Rain ${shown.rain}%` : null,
    shown.sunrise ? `Sunrise ${clock(shown.sunrise)}` : null,
    shown.sunset ? `Sunset ${clock(shown.sunset)}` : null,
  ].filter(Boolean) as string[];

  const chip: React.CSSProperties = {
    minHeight: 32,
    padding: "0 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.8)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={wrap}>
      <span style={{ flex: "1 1 240px", minWidth: 0 }}>
        {showTomorrow ? "Tomorrow · " : ""}
        {parts.join(" · ")}
      </span>
      {data.tomorrow && (
        <button type="button" style={chip} onClick={() => setShowTomorrow((v) => !v)}>
          {showTomorrow ? "Today" : "Tomorrow"}
        </button>
      )}
      <button
        type="button"
        style={chip}
        onClick={() => {
          const next = unit === "c" ? "f" : "c";
          setUnit(next);
          writeUnit(next);
        }}
        aria-label="Toggle temperature unit"
      >
        {unit === "c" ? "°F" : "°C"}
      </button>
    </div>
  );
};

export default WeatherBar;
