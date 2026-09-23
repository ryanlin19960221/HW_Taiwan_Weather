"use client";

import type { StationProperties } from "@/lib/types";
import { temperatureColor } from "@/lib/color-scale";

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  highlight,
}: {
  icon: string;
  label: string;
  value: number | string | null;
  unit?: string;
  highlight?: boolean;
}) {
  const displayVal =
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="flex flex-col justify-between rounded-xl bg-slate-900/60 p-2.5 border border-white/5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className={`font-mono text-base font-semibold ${
            highlight ? "text-sky-300" : "text-slate-100"
          }`}
        >
          {displayVal}
        </span>
        {unit && displayVal !== "—" && (
          <span className="text-[10px] text-slate-400 font-normal">{unit}</span>
        )}
      </div>
    </div>
  );
}

export default function WeatherStationPopup({ p }: { p: StationProperties }) {
  const temp = p.temperature;
  const tempCol = temp !== null ? temperatureColor(temp) : "#38bdf8";

  return (
    <div className="w-[280px] p-4 font-sans text-slate-100">
      {/* 頂部：測站與位置標籤 */}
      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-bold tracking-tight text-white">
              {p.stationName}
            </h3>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              {p.stationId}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {[p.county, p.town].filter(Boolean).join(" · ") || "台灣氣象測站"}
          </p>
        </div>

        {p.weather && (
          <div className="rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-sky-200">
            {p.weather}
          </div>
        )}
      </div>

      {/* 氣溫重點大字展示 */}
      <div className="my-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] p-3 border border-white/10">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            即時氣溫
          </span>
          <div className="flex items-baseline">
            <span
              className="font-mono text-3xl font-extrabold tracking-tight"
              style={{ color: tempCol }}
            >
              {temp !== null ? temp.toFixed(1) : "—"}
            </span>
            <span className="ml-1 text-sm font-semibold text-slate-400">°C</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            最大瞬間風
          </span>
          <div className="font-mono text-base font-semibold text-slate-200">
            {p.gustSpeed !== null ? `${p.gustSpeed} m/s` : "—"}
          </div>
        </div>
      </div>

      {/* 2x3 氣象指標網格 */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          icon="💧"
          label="相對濕度"
          value={p.humidity}
          unit="%"
          highlight
        />
        <MetricCard
          icon="🌧️"
          label="本日雨量"
          value={p.precipitation}
          unit="mm"
          highlight={Number(p.precipitation) > 0}
        />
        <MetricCard
          icon="💨"
          label="風速"
          value={p.windSpeed}
          unit="m/s"
        />
        <MetricCard
          icon="🧭"
          label="風向"
          value={p.windDirection !== null ? `${p.windDirection}°` : "—"}
        />
        <MetricCard
          icon="📊"
          label="大氣壓力"
          value={p.pressure}
          unit="hPa"
        />
        <MetricCard
          icon="☀️"
          label="紫外線指數"
          value={p.uvi}
        />
      </div>

      {/* 底部時間戳與即時狀態 */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>即時觀測</span>
        </div>
        <span className="font-mono text-slate-400">{fmtTime(p.observedAt)}</span>
      </div>
    </div>
  );
}
