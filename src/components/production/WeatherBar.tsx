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

interface WeatherBarProps {
  location: string;
  /** When set, show the forecast for this YYYY-MM-DD day instead of today/tomorrow. */
  date?: string;
  /** Optional action button (e.g. "Add weather to call sheet") for the shown day. */
  onApply?: (forecast: DatedForecast) => void;
  applyLabel?: string;
}

/** Forecast for one specific shoot day, with an optional apply action. */
const DatedWeather = ({ location, date, onApply, applyLabel }: Required<Pick<WeatherBarProps, "location" | "date">> & Pick<WeatherBarProps, "onApply" | "applyLabel">) => {
  const [data, setData] = useState<DatedForecast | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "range" | "failed">("loading");
  const [unit, setUnit] = useState<"c" | "f">(readUnit);

  useEffect(() => {
    let live = true;
    setState("loading");
    setData(null);
    fetchWeatherForDate(location, date)
      .then((d) => {
        if (!live) return;
        setData(d);
        setState("ok");
      })
      .catch((err) => {
        if (!live) return;
        setState(err instanceof WeatherRangeError ? "range" : "failed");
      });
    return () => {
      live = false;
    };
  }, [location, date]);

  if (state === "loading") return <div style={wrap}>Loading forecast for the shoot date…</div>;
  if (state === "range")
    return <div style={wrap}>Forecast available within {FORECAST_WINDOW_DAYS} days of the shoot</div>;
  if (state === "failed" || !data) return <div style={wrap}>Weather unavailable for this location</div>;

  const degShort = (c: number) => (unit === "c" ? `${c}°` : `${Math.round((c * 9) / 5 + 32)}°`);

  const parts = [
    data.place,
    WMO[data.code] ?? "—",
    `↑${degShort(data.max)} ↓${degShort(data.min)}`,
    data.rain != null ? `Rain ${data.rain}%` : null,
    data.sunrise ? `Sunrise ${clock(data.sunrise)}` : null,
    data.sunset ? `Sunset ${clock(data.sunset)}` : null,
  ].filter(Boolean) as string[];

  return (
    <div style={wrap}>
      <span style={{ flex: "1 1 240px", minWidth: 0 }}>
        Shoot date · {parts.join(" · ")}
      </span>
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
      {onApply && (
        <button type="button" style={chip} onClick={() => onApply(data)}>
          {applyLabel || "Add weather"}
        </button>
      )}
    </div>
  );
};

const WeatherBar = ({ location, date, onApply, applyLabel }: WeatherBarProps) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"c" | "f">(readUnit);
  const [showTomorrow, setShowTomorrow] = useState(false);
  const dated = Boolean(date && location.trim());

  useEffect(() => {
    if (dated || !location.trim()) return;
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
  }, [location, dated]);

  if (!location.trim()) return null;
  if (dated)
    return (
      <DatedWeather location={location.trim()} date={date!} onApply={onApply} applyLabel={applyLabel} />
    );
  if (loading && !data) return <div style={wrap}>Loading weather…</div>;
  if (failed || !data) return <div style={wrap}>Weather unavailable</div>;

  const deg = (c: number) => (unit === "c" ? `${c}°C` : `${Math.round((c * 9) / 5 + 32)}°F`);
  const degShort = (c: number) => (unit === "c" ? `${c}°` : `${Math.round((c * 9) / 5 + 32)}°`);

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
