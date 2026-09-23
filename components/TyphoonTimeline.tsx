"use client";

import { categorize, sampleAt, type TyTimeline } from "@/lib/typhoonFrames";

interface Props {
  timeline: TyTimeline;
  time: number; // 目前顯示時刻（unix ms）
  playing: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

const fmtDay = (t: number) =>
  new Date(t).toLocaleDateString("zh-TW", { month: "numeric", day: "numeric" });
const fmtHour = (t: number) => `${String(new Date(t).getHours()).padStart(2, "0")}時`;
const pos = (t: number, min: number, max: number) =>
  max > min ? ((t - min) / (max - min)) * 100 : 0;

export default function TyphoonTimeline({
  timeline,
  time,
  playing,
  onTogglePlay,
  onSeek,
}: Props) {
  const { tMin, tMax, tCurrent, ticks, tracks } = timeline;
  const step = Math.max(60_000, Math.round((tMax - tMin) / 1000));

  const primary = tracks[0];
  const s = sampleAt(primary.moments, time);
  const isForecast = time > tCurrent + 1000;
  const category = categorize(s?.maxWind ?? null);

  const fillPct = pos(time, tMin, tMax);
  const nowPct = pos(tCurrent, tMin, tMax);

  return (
    <div className="pointer-events-auto absolute bottom-[132px] left-1/2 z-[900] flex w-[min(94vw,500px)] -translate-x-1/2 items-center gap-3.5 rounded-2xl jojo-panel px-4 py-3 shadow-2xl md:bottom-8">
      <button
        onClick={onTogglePlay}
        className="jojo-action-btn grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-md active:scale-95"
        aria-label={playing ? "暫停" : "播放"}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
            <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.6c0-.8.86-1.3 1.55-.9l8 5.4c.64.43.64 1.37 0 1.8l-8 5.4c-.7.4-1.55-.1-1.55-.9V2.6Z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between text-[11px] text-amber-300">
          <span className="flex items-center gap-1.5 font-black italic tracking-wide text-white">
            <span className="text-sm">🌀</span>
            【替身暴風】{primary.name}
            {category && (
              <span className="rounded bg-rose-950 border border-rose-500 px-1 text-[10px] text-rose-300">
                {category}
              </span>
            )}
          </span>
          <span
            className={`rounded px-1.5 py-px text-[10px] font-mono font-black ${
              isForecast
                ? "bg-rose-500 text-white"
                : "bg-amber-400 text-purple-950"
            }`}
          >
            {isForecast ? "FUTURE 預報" : "NOW 實測"}
          </span>
        </div>

        {/* 進度軌 */}
        <div className="relative flex h-5 items-center">
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-purple-950 border border-purple-800" />
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-r-full bg-rose-500/30"
            style={{ left: `${nowPct}%`, right: 0 }}
          />
          <div
            className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
            style={{ width: `${fillPct}%` }}
          />
          {ticks.map((tk, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-amber-400/40"
              style={{ left: `${pos(tk, tMin, tMax)}%` }}
            />
          ))}
          {/* 現在分界線 */}
          <span
            className="pointer-events-none absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-amber-300 shadow-[0_0_8px_#facc15]"
            style={{ left: `${nowPct}%` }}
          />
          <input
            type="range"
            min={tMin}
            max={tMax}
            step={step}
            value={time}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="radar-range absolute inset-0 w-full"
            aria-label="颱風預報時刻"
          />
        </div>

        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-purple-300 font-bold">
          <span>{fmtDay(tMin)}</span>
          <span className="text-amber-300 font-black">● 覺醒點</span>
          <span>{fmtDay(tMax)}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-mono text-[10px] text-purple-300">{fmtDay(time)}</div>
        <div className="mt-0.5 font-mono text-base font-black tabular-nums leading-none text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {fmtHour(time)}
        </div>
        {s && (
          <div className="mt-1 font-mono text-[10px] text-slate-300 tabular-nums">
            {s.maxWind !== null ? `${Math.round(s.maxWind)}m/s` : ""}
            {s.pressure !== null ? ` · ${Math.round(s.pressure)}hPa` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
