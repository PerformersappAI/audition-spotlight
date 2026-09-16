import { useEffect, useState } from "react";
import {
  clock,
  fetchWeather,
  fetchWeatherForDate,
  FORECAST_WINDOW_DAYS,
  WeatherRangeError,
  WMO,
  type DatedForecast,
  type WeatherData,
} from "@/lib/translator/weather";

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

const WeatherBar = ({ location }: { location: string }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"c" | "f">(readUnit);
  const [showTomorrow, setShowTomorrow] = useState(false);

  useEffect(() => {
    if (!location.trim()) return;
    let live = true;
    setLoading(true);
    setFailed(false);
    fetchWeather(location.trim())
      .then((d) => {
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

  const deg = (c: number) => (unit === "c" ? `${c}°C` : `${Math.round((c * 9) / 5 + 32)}°F`);
  const degShort = (c: number) => (unit === "c" ? `${c}°` : `${Math.round((c * 9) / 5 + 32)}°`);

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
