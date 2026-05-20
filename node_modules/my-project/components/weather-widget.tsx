"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Loader2,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { fetchWeather, type WeatherData } from "@/lib/weather-api";
import { cn } from "@/lib/utils";

function weatherIconForCode(icon: string): LucideIcon {
  const code = icon.slice(0, 2);
  if (code === "01") return icon.endsWith("n") ? Moon : Sun;
  if (code === "02") return icon.endsWith("n") ? CloudMoon : CloudSun;
  if (code === "03" || code === "04") return Cloud;
  if (code === "09" || code === "10") return CloudRain;
  if (code === "11") return CloudLightning;
  if (code === "13") return CloudSnow;
  if (code === "50") return CloudFog;
  return Cloud;
}

type WeatherState = {
  weather: WeatherData | null;
  loading: boolean;
  error: boolean;
};

const INITIAL_WEATHER: WeatherState = {
  weather: null,
  loading: true,
  error: false,
};

export function WeatherWidget() {
  const [state, setState] = useState<WeatherState>(INITIAL_WEATHER);

  const patchState = (patch: Partial<WeatherState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      patchState({ loading: true, error: false });
      try {
        const data = await fetchWeather("Seoul", "KR");
        if (!cancelled) patchState({ weather: data });
      } catch {
        if (!cancelled) patchState({ weather: null, error: true });
      } finally {
        if (!cancelled) patchState({ loading: false });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const Icon = state.weather ? weatherIconForCode(state.weather.icon) : null;

  return (
    <aside
      className={cn(
        "pointer-events-auto self-end",
        "flex items-center gap-2 rounded-full border border-border/60 bg-card/75 px-3 py-1.5",
        "text-xs text-muted-foreground shadow-sm backdrop-blur-md",
      )}
      aria-label="서울 날씨"
    >
      {state.loading && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden />
          <span>날씨</span>
        </>
      )}

      {!state.loading && state.error && <span className="text-destructive/80">날씨 불가</span>}

      {!state.loading && state.weather && Icon && (
        <>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/90 ring-1 ring-border/50"
            aria-hidden
          >
            <Icon className="h-4 w-4 text-accent" strokeWidth={2} />
          </span>
          <span className="font-medium text-foreground tabular-nums">
            {Math.round(state.weather.temp_c)}°
          </span>
          <span className="text-foreground/80">{state.weather.description}</span>
          <span className="text-muted-foreground/80">· 서울</span>
        </>
      )}
    </aside>
  );
}
