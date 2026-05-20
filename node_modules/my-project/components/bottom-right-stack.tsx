"use client";

import { GeminiFloatingChat } from "@/components/gemini-chat-floating";
import { WeatherWidget } from "@/components/weather-widget";
import { cn } from "@/lib/utils";

/** 홈 화면 오른쪽 하단: 날씨 + Gemini 채팅 */
export function BottomRightStack() {
  return (
    <div
      className={cn(
        "pointer-events-none fixed z-40 flex flex-col items-end gap-2",
        "bottom-6 right-6 w-[min(100%,21.5rem)]",
        "max-md:bottom-4 max-md:right-4 max-md:left-4 max-md:w-auto",
      )}
    >
      <WeatherWidget />
      <GeminiFloatingChat />
    </div>
  );
}
