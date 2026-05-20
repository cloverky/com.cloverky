/** FastAPI 백엔드 GET /weather */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export type WeatherData = {
  city: string;
  country: string;
  temp_c: number;
  feels_like_c: number;
  description: string;
  icon: string;
  humidity: number;
};

type FastApiErrorBody = { detail?: string | { msg?: string }[] };

function parseApiError(data: FastApiErrorBody, status: number): string {
  const { detail } = data;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg ?? JSON.stringify(d)).join("\n");
  }
  return `요청 실패 (${status})`;
}

export async function fetchWeather(city = "Seoul", country = "KR"): Promise<WeatherData> {
  const params = new URLSearchParams({ city, country });
  const res = await fetch(`${API_BASE}/weather?${params}`, { cache: "no-store" });
  const data = (await res.json()) as WeatherData & FastApiErrorBody;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data;
}

export function weatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
