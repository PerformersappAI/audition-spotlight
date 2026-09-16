/** Shared Open-Meteo lookup used by the weather bar and by message exports. */

/** WMO weather codes → short English labels. */
export const WMO: Record<number, string> = {
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

export interface DayForecast {
  max: number;
  min: number;
  rain: number | null;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  place: string;
  temp: number;
  code: number;
  today: DayForecast;
  tomorrow: DayForecast | null;
}

const CACHE_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; data: WeatherData }>();

/** ISO timestamp from Open-Meteo is already in the location's local time. */
export const clock = (iso: string) => (iso || "").slice(11, 16);

/** Forecast for a specific calendar day (used by the call sheet). */
export interface DatedForecast extends DayForecast {
  place: string;
  code: number;
  date: string;
}

/** Thrown when the requested day is in the past or beyond the forecast window. */
export class WeatherRangeError extends Error {}

/** How many days ahead Open-Meteo reliably forecasts for our purposes. */
export const FORECAST_WINDOW_DAYS = 14;

interface GeoHit {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
}

const geoCache = new Map<string, GeoHit>();

const lookupOnce = async (query: string): Promise<GeoHit | null> => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json?.results?.[0] ?? null;
};

/**
 * Geocode a location. Full street addresses fail with this geocoder, so retry
 * with the trailing comma-separated parts (city, then country) before giving up.
 * Very short parts ("UK", "CA") and postcodes are skipped — they match the wrong
 * place far too often.
 */
export async function geocodeLocation(location: string): Promise<GeoHit> {
  const raw = location.trim();
  const key = raw.toLowerCase();
  const cached = geoCache.get(key);
  if (cached) return cached;

  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const attempts = [raw];
  if (parts.length > 1) {
    [...parts].reverse().forEach((part) => {
      if (part.length > 3 && !/^\d[\d\s-]*$/.test(part)) attempts.push(part);
    });
  }


  for (const attempt of attempts) {
    const hit = await lookupOnce(attempt);
    if (hit) {
      geoCache.set(key, hit);
      return hit;
    }
  }
  throw new Error("location not found");
}

const placeName = (hit: GeoHit) => [hit.name, hit.country].filter(Boolean).join(", ");

/** Whole days between today (local) and an ISO YYYY-MM-DD date. */
export const daysFromToday = (isoDate: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((isoDate || "").trim());
  if (!m) return null;
  const target = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

/** Forecast for one specific shoot day, within the next 14 days. */
export async function fetchWeatherForDate(location: string, isoDate: string): Promise<DatedForecast> {
  const offset = daysFromToday(isoDate);
  if (offset === null || offset < 0 || offset > FORECAST_WINDOW_DAYS) {
    throw new WeatherRangeError("out of forecast range");
  }

  const hit = await geocodeLocation(location);
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
      `&timezone=auto&start_date=${isoDate}&end_date=${isoDate}`,
  );
  if (!res.ok) throw new Error("forecast failed");
  const json = await res.json();
  const d = json?.daily;
  if (!d || d.temperature_2m_max?.[0] == null) throw new Error("no forecast");

  return {
    place: placeName(hit),
    code: d.weather_code?.[0] ?? 0,
    date: isoDate,
    max: Math.round(d.temperature_2m_max[0]),
    min: Math.round(d.temperature_2m_min[0]),
    rain: d.precipitation_probability_max?.[0] ?? null,
    sunrise: d.sunrise?.[0] || "",
    sunset: d.sunset?.[0] || "",
  };
}

export async function fetchWeather(location: string): Promise<WeatherData> {
  const key = location.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

  const hit = await geocodeLocation(location);


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

  const data: WeatherData = {
    place: [hit.name, hit.country].filter(Boolean).join(", "),
    temp: Math.round(json.current.temperature_2m),
    code: json.current.weather_code,
    today: day(0),
    tomorrow: d.time?.length > 1 ? day(1) : null,
  };
  cache.set(key, { at: Date.now(), data });
  return data;
}

/** One-line weather summary for document headers; empty string when unavailable. */
export async function weatherLine(location?: string | null): Promise<string> {
  if (!location || !location.trim()) return "";
  try {
    const d = await fetchWeather(location.trim());
    return [
      d.place,
      `${d.temp}°C`,
      WMO[d.code] ?? "",
      `High ${d.today.max}° / Low ${d.today.min}°`,
      d.today.rain != null ? `Rain ${d.today.rain}%` : "",
      d.today.sunrise ? `Sunrise ${clock(d.today.sunrise)}` : "",
      d.today.sunset ? `Sunset ${clock(d.today.sunset)}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  } catch {
    return "";
  }
}
