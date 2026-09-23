"use client";

import type { WeatherApiResponse } from "@/lib/types";
import { assetUrl } from "@/lib/basePath";

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
    <div className="pointer-events-auto w-84 jojo-panel rounded-2xl p-4">
      {/* 標題與即時連線標籤 */}
      <div className="flex items-center justify-between border-b-2 border-amber-400/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.6)] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl("/images/jojo/jotaro.jpg")}
              alt="Jotaro"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black italic tracking-wide text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                台灣即時氣象
              </h1>
              <span className="rounded bg-purple-700/80 px-1.5 py-0.5 font-bold text-[11px] text-white border border-amber-400/50 shadow-sm">
                林丞斌
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-wider text-purple-300 uppercase">
              STAND: WEATHER REPORT · 氣候預報
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-purple-950/80 border-2 border-amber-400/80 px-2.5 py-1 text-[11px] font-black text-amber-300 shadow-[2px_2px_0px_#9333ea]">
          <span className="jojo-menace text-xs">ゴ</span>
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
