"use client";

import { useCallback, useEffect, useState } from "react";

interface Warning {
  id: string;
  event: string;
  headline: string;
  effective: string | null;
  expires: string | null;
  updated: string | null;
  capUrl: string | null;
}

interface WarningsResponse {
  success: boolean;
  count?: number;
  warnings?: Warning[];
  stale?: boolean;
  error?: string;
}

function eventBadge(event: string): { bg: string; text: string; border: string } {
  if (/高溫/.test(event))
    return { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/30" };
  if (/雨|豪雨|大雨|降雨/.test(event))
    return { bg: "bg-sky-500/20", text: "text-sky-300", border: "border-sky-500/30" };
  if (/風|強風/.test(event))
    return { bg: "bg-teal-500/20", text: "text-teal-300", border: "border-teal-500/30" };
  if (/雷/.test(event))
    return { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/30" };
  if (/濃霧|霧/.test(event))
    return { bg: "bg-slate-500/20", text: "text-slate-300", border: "border-slate-500/30" };
  return { bg: "bg-rose-500/20", text: "text-rose-300", border: "border-rose-500/30" };
}

function fmtExpires(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function WarningBanner() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [stale, setStale] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // 預設為精簡收合模式，點擊可展開看詳細
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/warnings", { cache: "no-store" });
      const json = (await res.json()) as WarningsResponse;
      if (json.success) {
        setWarnings(json.warnings ?? []);
        setStale(Boolean(json.stale));
      }
    } catch {
      // 輔助特報
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [load]);

  if (!loaded) return null;

  const hasWarnings = warnings.length > 0;
  const eventTypes = Array.from(
    new Set(warnings.map((w) => w.event).filter(Boolean))
  );

  return (
    <div className="pointer-events-auto w-[min(94vw,560px)] glass-panel rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden border border-white/10">
      {/* 標題欄 */}
      <div
        onClick={() => hasWarnings && setOpen((v) => !v)}
        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${
          hasWarnings ? "cursor-pointer hover:bg-white/[0.04]" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {hasWarnings ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          )}

          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>天氣特報</span>
            {hasWarnings ? (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                {warnings.length} 則示警
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                全台平靜
              </span>
            )}
          </span>

          {/* 收合狀態下的特報徽章 */}
          {!open &&
            eventTypes.slice(0, 3).map((e) => {
              const b = eventBadge(e);
              return (
                <span
                  key={e}
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold border ${b.bg} ${b.text} ${b.border}`}
                >
                  {e}
                </span>
              );
            })}
          {!open && eventTypes.length > 3 && (
            <span className="text-[10px] text-slate-400">
              +{eventTypes.length - 3}
            </span>
          )}
        </div>

        {hasWarnings && (
          <button className="jojo-btn flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black tracking-wide text-amber-300">
            <span>{open ? "收合 (CLOSE)" : "替身警報！查看詳情"}</span>
            <span className="text-[10px] font-mono">{open ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {/* 展開後的詳細特報列表 */}
      {open && hasWarnings && (
        <div className="max-h-60 space-y-2 overflow-y-auto border-t border-white/10 p-3 bg-slate-950/40">
          {stale && (
            <div className="rounded-xl bg-amber-500/10 p-2 text-xs text-amber-300 border border-amber-500/20">
              ⚠️ 特報即時來源連線逾時，顯示快取狀態。
            </div>
          )}
          {warnings.map((w) => {
            const b = eventBadge(w.event);
            return (
              <div
                key={w.id}
                className="rounded-xl bg-white/[0.04] p-3 border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${b.bg} ${b.text} ${b.border}`}
                  >
                    {w.event || "中央氣象署特報"}
                  </span>
                  {w.expires && (
                    <span className="font-mono text-[10px] text-slate-400">
                      有效至 {fmtExpires(w.expires)}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  {w.headline}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
