"use client";

import { useState } from "react";
import type { LayerKey, WeatherApiResponse } from "@/lib/types";
import { MODES } from "@/components/WeatherLayerControl";
import WeatherSummaryPanel from "@/components/WeatherSummaryPanel";
import WeatherLegend from "@/components/WeatherLegend";

interface Props {
  meta: WeatherApiResponse;
  mode: LayerKey;
  onModeChange: (m: LayerKey) => void;
  basemap: "dark" | "osm";
  onBasemapChange: (b: "dark" | "osm") => void;
  showCounties: boolean;
  onToggleCounties: (v: boolean) => void;
  showWindStations: boolean;
  onToggleWindStations: (v: boolean) => void;
  showTempLabels: boolean;
  onToggleTempLabels: (v: boolean) => void;
  onLocate: () => void;
  locating: boolean;
  locateMsg: string | null;
  userLocation: { lat: number; lng: number } | null;
  onRefresh: () => void;
}

export default function MobileControls({
  meta,
  mode,
  onModeChange,
  basemap,
  onBasemapChange,
  showCounties,
  onToggleCounties,
  showWindStations,
  onToggleWindStations,
  showTempLabels,
  onToggleTempLabels,
  onLocate,
  locating,
  locateMsg,
  userLocation,
  onRefresh,
}: Props) {
  const [sheet, setSheet] = useState<null | "summary" | "settings">(null);
  const close = () => setSheet(null);

  return (
    <div className="md:hidden">
      {/* 底部控制列：圖層 pills + 工具列 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[900] flex flex-col gap-2 px-3 pb-6">
        {/* 工具列：更新時間、摘要、設定 */}
        <div className="pointer-events-auto flex items-center justify-between gap-2">
          <button
            onClick={onRefresh}
            className="jojo-btn rounded-xl px-3 py-1.5 text-[11px] font-black"
          >
            ⚡ 替身同步{" "}
            {new Date(meta.updatedAt).toLocaleTimeString("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </button>
          <div className="flex items-center gap-2">
            <SquareBtn label="摘要" onClick={() => setSheet("summary")}>
              ★ 摘要
            </SquareBtn>
            <SquareBtn label="設定" onClick={() => setSheet("settings")}>
              ⚙️ 替身
            </SquareBtn>
          </div>
        </div>

        {/* 色階條 */}
        <div className="pointer-events-auto flex justify-center">
          <WeatherLegend mode={mode} />
        </div>

        {/* 圖層切換：橫向可滑 pills */}
        <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-2xl jojo-panel p-2 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => onModeChange(m.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${
                  active ? "jojo-btn jojo-btn-active" : "jojo-btn"
                }`}
              >
                <span>{m.icon}</span>
                <span className="whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 摘要 Bottom Sheet */}
      {sheet === "summary" && (
        <Backdrop onClose={close}>
          <div className="relative max-h-[85vh] overflow-y-auto p-4">
            <CloseX onClick={close} />
            <WeatherSummaryPanel meta={meta} />
          </div>
        </Backdrop>
      )}

      {/* 設定 Bottom Sheet */}
      {sheet === "settings" && (
        <Backdrop onClose={close}>
          <div className="relative w-[min(94vw,380px)] rounded-2xl jojo-panel p-5 text-white shadow-2xl">
            <CloseX onClick={close} />
            <div className="mb-3 flex items-center justify-between border-b-2 border-amber-400/40 pb-2">
              <span className="font-black italic text-amber-300">
                ★ 替身領域設定
              </span>
              <span className="jojo-menace text-xs">ゴゴゴ</span>
            </div>

            <div className="space-y-2">
              <ToggleRow
                checked={showCounties}
                onChange={onToggleCounties}
                label="★ 縣市行政領域界線"
              />
              {mode === "temperature" && (
                <ToggleRow
                  checked={showTempLabels}
                  onChange={onToggleTempLabels}
                  label="★ 氣溫數值標籤"
                />
              )}
              {mode === "wind" && (
                <ToggleRow
                  checked={showWindStations}
                  onChange={onToggleWindStations}
                  label="★ 風場向量箭頭"
                />
              )}
            </div>

            <div className="mt-4 border-t-2 border-amber-400/30 pt-3">
              <div className="mb-2 text-xs font-black text-amber-300">
                世界底圖
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onBasemapChange("dark")}
                  className={`rounded-xl py-2 text-xs font-black transition-all ${
                    basemap === "dark"
                      ? "bg-amber-400 text-purple-950 shadow-[2px_2px_0px_#9333ea]"
                      : "bg-purple-950 border border-purple-700 text-slate-300"
                  }`}
                >
                  🌑 黑暗空間
                </button>
                <button
                  onClick={() => onBasemapChange("osm")}
                  className={`rounded-xl py-2 text-xs font-black transition-all ${
                    basemap === "osm"
                      ? "bg-amber-400 text-purple-950 shadow-[2px_2px_0px_#9333ea]"
                      : "bg-purple-950 border border-purple-700 text-slate-300"
                  }`}
                >
                  🏙️ 杜王町街景
                </button>
              </div>
            </div>

            <button
              onClick={onLocate}
              disabled={locating}
              className="jojo-action-btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black shadow-lg disabled:opacity-60"
            >
              <span>{locating ? "替身搜尋中…" : "🧭 替身感知！定位我的座標"}</span>
            </button>
            {locateMsg && !userLocation && (
              <div className="mt-2 rounded-xl bg-amber-500/20 border border-amber-400/40 p-2 text-xs text-amber-200">
                {locateMsg}
              </div>
            )}
          </div>
        </Backdrop>
      )}
    </div>
  );
}

function SquareBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="jojo-btn flex h-9 items-center justify-center rounded-xl px-2.5 text-xs font-black shadow-lg"
    >
      {children}
    </button>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-black transition-all ${
        checked
          ? "bg-purple-900/80 border-2 border-amber-400 text-amber-300 shadow-[2px_2px_0px_#facc15]"
          : "bg-slate-900/70 border border-slate-700 text-slate-400"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
          checked ? "bg-amber-400 text-purple-950" : "bg-slate-800 text-slate-400"
        }`}
      >
        {checked ? "STAND ON" : "OFF"}
      </span>
    </button>
  );
}

function Backdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full flex justify-center pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="關閉"
      className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 border-2 border-amber-400 text-amber-300 shadow-lg font-black text-sm"
    >
      ✕
    </button>
  );
}
