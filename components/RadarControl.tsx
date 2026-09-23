"use client";

interface RadarFrameMeta {
  time: number; // unix 秒
  path: string;
}

interface Props {
  frames: RadarFrameMeta[];
  idx: number;
  playing: boolean;
  onTogglePlay: () => void;
  onSeek: (idx: number) => void;
}

/**
 * JOJO 風格雷達回波動畫時間軸控制列
 */
export default function RadarControl({
  frames,
  idx,
  playing,
  onTogglePlay,
  onSeek,
}: Props) {
  const last = frames.length - 1;
  const cur = frames[idx];
  const pct = last > 0 ? (idx / last) * 100 : 0;

  const clock = new Date(cur.time * 1000).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const minsAgo = Math.round((frames[last].time - cur.time) / 60);
  const relative = minsAgo <= 0 ? "現在 (NOW)" : `−${minsAgo} 分`;

  return (
    <div className="absolute bottom-[132px] left-1/2 z-[900] flex w-[min(94vw,460px)] -translate-x-1/2 items-center gap-3.5 rounded-2xl jojo-panel px-4 py-3 shadow-2xl md:bottom-20">
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
            <span className="text-sm">🛰️</span> 隱者之紫・念寫序列
          </span>
          <span className="font-mono font-bold text-purple-300">
            FRAME {idx + 1}/{frames.length}
          </span>
        </div>

        {/* 進度軌 */}
        <div className="relative flex h-5 items-center">
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-purple-950 border border-purple-800" />
          <div
            className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            style={{ width: `${pct}%` }}
          />
          {frames.map((f, i) => (
            <span
              key={f.path}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-amber-400/40"
              style={{ left: `${last > 0 ? (i / last) * 100 : 0}%` }}
            />
          ))}
          <input
            type="range"
            min={0}
            max={last}
            value={idx}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="radar-range absolute inset-0 w-full"
            aria-label="雷達影格時間"
          />
        </div>

        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-purple-300 font-bold">
          <span>−2H 前</span>
          <span>即時念寫</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-mono text-base font-black tabular-nums leading-none text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {clock}
        </div>
        <div
          className={`mt-1 font-bold text-[10px] uppercase tracking-wider ${
            minsAgo <= 0 ? "text-amber-400" : "text-purple-300"
          }`}
        >
          {relative}
        </div>
      </div>
    </div>
  );
}
