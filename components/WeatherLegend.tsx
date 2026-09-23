"use client";

import type { LayerKey } from "@/lib/types";
import {
  TEMP_STOPS,
  WIND_STOPS,
  HUMIDITY_STOPS,
  PRECIP_STOPS,
  type ScaleStop,
} from "@/lib/color-scale";

const WEATHER_LEGEND = [
  { icon: "☀️", label: "晴朗" },
  { icon: "⛅", label: "多雲" },
  { icon: "☁️", label: "陰天" },
  { icon: "🌧️", label: "陣雨" },
  { icon: "⛈️", label: "雷雨" },
  { icon: "🌫️", label: "濃霧/靄" },
];

function GradientBar({
  title,
  unit,
  stops,
}: {
  title: string;
  unit: string;
  stops: ScaleStop[];
}) {
  const gradient = `linear-gradient(to right, ${stops
    .map((s) => s.color)
    .join(", ")})`;
  const bounds = stops.slice(0, -1).map((s) => s.max);

  return (
    <div className="pointer-events-auto w-72 glass-panel rounded-2xl p-3 shadow-2xl">
      <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
        <span className="font-semibold text-white">{title}</span>
        <span className="font-mono text-[11px] text-sky-400 font-bold">{unit}</span>
      </div>

      <div className="relative mt-2">
        <div
          className="h-3 w-full rounded-full border border-white/20 shadow-inner"
          style={{ background: gradient }}
        />
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-400">
          {bounds.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeatherLegend({ mode }: { mode: LayerKey }) {
  if (mode === "temperature")
    return <GradientBar title="氣溫色帶" unit="°C" stops={TEMP_STOPS} />;
  if (mode === "wind")
    return <GradientBar title="風速級距" unit="m/s" stops={WIND_STOPS} />;
  if (mode === "humidity")
    return <GradientBar title="相對濕度" unit="%" stops={HUMIDITY_STOPS} />;
  if (mode === "precipitation")
    return <GradientBar title="累積降雨量" unit="mm" stops={PRECIP_STOPS} />;

  if (mode === "radar") {
    return (
      <div className="pointer-events-auto w-72 glass-panel rounded-2xl p-3 shadow-2xl">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-white">雷達回波反射率</span>
          <span className="font-mono text-[11px] text-sky-400 font-bold">dBZ</span>
        </div>
        <div className="relative mt-2">
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-sky-400 via-lime-400 via-yellow-400 to-red-500 border border-white/20" />
          <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400">
            <span>弱回波 (小雨)</span>
            <span>中度</span>
            <span className="text-rose-400">強烈 (豪雨/冰雹)</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "typhoon") {
    return (
      <div className="pointer-events-auto w-72 glass-panel rounded-2xl p-3.5 text-xs text-slate-300 shadow-2xl">
        <div className="mb-2 font-bold text-white flex items-center justify-between border-b border-white/10 pb-1.5">
          <span>🌀 颱風圖層標示說明</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 shrink-0 bg-slate-300" />
            <span>歷史分析軌跡</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-0.5 w-6 shrink-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #f43f5e 0 6px, transparent 6px 13px)",
              }}
            />
            <span>未來預報路徑（隨強度變色）</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 shrink-0 rounded border border-rose-400/80 bg-rose-500/20" />
            <span>70% 機率不確定錐形</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative h-3 w-3 shrink-0 rounded-full border border-amber-400 bg-amber-400/20">
              <span className="absolute inset-[3px] rounded-full border border-red-500 bg-red-500/35" />
            </span>
            <span>暴風圈：七級風(外) / 十級風(內)</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10">
          <div className="mb-1 text-[11px] font-medium text-slate-400">
            強度分級
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              ["熱帶低壓", "#38bdf8"],
              ["輕度颱風", "#facc15"],
              ["中度颱風", "#fb923c"],
              ["強烈颱風", "#f43f5e"],
            ].map(([label, c]) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full shadow-sm"
                  style={{ backgroundColor: c }}
                />
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "weather") {
    return (
      <div className="pointer-events-auto w-72 glass-panel rounded-2xl p-3 shadow-2xl">
        <div className="mb-2 text-xs font-bold text-white border-b border-white/10 pb-1.5">
          天氣現象代表符號
        </div>
        <div className="grid grid-cols-3 gap-2">
          {WEATHER_LEGEND.map((it) => (
            <div
              key={it.label}
              className="flex items-center gap-1.5 rounded-lg bg-white/5 p-1.5 text-xs text-slate-200"
            >
              <span className="text-base">{it.icon}</span>
              <span className="font-medium">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
