"use client";

import type { WeatherApiResponse } from "@/lib/types";

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

function StatCard({
  icon,
  label,
  station,
  value,
  unit,
  gradient,
  accentColor,
}: {
  icon: string;
  label: string;
  station?: string;
  value?: number | null;
  unit: string;
  gradient: string;
  accentColor: string;
}) {
  const displayVal = value === null || value === undefined ? "—" : value;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-3 border border-white/10 ${gradient} transition-all duration-300 hover:scale-[1.02] hover:border-white/20`}
    >
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="font-medium">{label}</span>
        <span className="text-base">{icon}</span>
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="font-mono text-2xl font-bold tracking-tight text-white"
          style={{ textShadow: `0 0 16px ${accentColor}` }}
        >
          {displayVal}
        </span>
        <span className="text-xs font-semibold text-slate-400">{unit}</span>
      </div>

      <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-300">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="truncate font-medium">{station ?? "—"}</span>
      </div>
    </div>
  );
}

export default function WeatherSummaryPanel({
  meta,
}: {
  meta: WeatherApiResponse;
}) {
  const s = meta.summary;

  return (
    <div className="pointer-events-auto w-80 glass-panel rounded-2xl p-4 shadow-2xl">
      {/* 標題與即時連線標籤 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-base shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            🇹🇼
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              台灣即時氣象
            </h1>
            <p className="text-[11px] text-slate-400">中央氣象署 CWA 觀測網</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>{meta.stationCount} 站連線</span>
        </div>
      </div>

      {/* 觀測資訊列表 */}
      <div className="mt-3 space-y-1.5 rounded-xl bg-slate-900/50 p-2.5 text-[11px] border border-white/5">
        <div className="flex justify-between items-center text-slate-400">
          <span>觀測時間</span>
          <span className="font-mono font-medium text-slate-200">
            {fmtTime(meta.updatedAt)}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>資料集來源</span>
          <span className="font-mono text-sky-300">{meta.source}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>資料狀態</span>
          <span
            className={`font-semibold ${
              meta.stale ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {meta.stale ? "⚠️ 舊資料回退" : "● 即時更新"}
          </span>
        </div>
      </div>

      {/* 4 大統計指標卡片 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatCard
          icon="🔥"
          label="全台最高溫"
          station={s.maxTemperature?.stationName}
          value={s.maxTemperature?.value}
          unit="°C"
          gradient="bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-transparent"
          accentColor="rgba(244, 63, 94, 0.4)"
        />
        <StatCard
          icon="❄️"
          label="全台最低溫"
          station={s.minTemperature?.stationName}
          value={s.minTemperature?.value}
          unit="°C"
          gradient="bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent"
          accentColor="rgba(6, 182, 212, 0.4)"
        />
        <StatCard
          icon="🌧️"
          label="最大累積雨量"
          station={s.maxPrecipitation?.stationName}
          value={s.maxPrecipitation?.value}
          unit="mm"
          gradient="bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent"
          accentColor="rgba(59, 130, 246, 0.4)"
        />
        <StatCard
          icon="💨"
          label="最大觀測風速"
          station={s.maxWindSpeed?.stationName}
          value={s.maxWindSpeed?.value}
          unit="m/s"
          gradient="bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent"
          accentColor="rgba(20, 184, 166, 0.4)"
        />
      </div>
    </div>
  );
}
