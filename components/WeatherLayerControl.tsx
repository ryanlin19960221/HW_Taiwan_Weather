"use client";

import type { LayerKey } from "@/lib/types";

export const MODES: { key: LayerKey; label: string; icon: string; desc: string }[] = [
  { key: "temperature", label: "氣溫分佈", icon: "🌡️", desc: "IDW 平滑填色" },
  { key: "precipitation", label: "累積雨量", icon: "🌧️", desc: "即時降雨場" },
  { key: "wind", label: "風場動態", icon: "💨", desc: "NOAA GFS 粒子" },
  { key: "radar", label: "雷達回波", icon: "🛰️", desc: "RainViewer 序列" },
  { key: "typhoon", label: "颱風動態", icon: "🌀", desc: "官方路徑預報" },
  { key: "humidity", label: "相對濕度", icon: "💧", desc: "全台水氣" },
  { key: "weather", label: "天氣概況", icon: "⛅", desc: "縣市晴雨符號" },
  { key: "stations", label: "測站點位", icon: "📍", desc: "362 站即時座標" },
];

interface Props {
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
}

function SwitchToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]">
      <span>{label}</span>
      <div
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? "bg-sky-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}

export default function WeatherLayerControl({
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
}: Props) {
  return (
    <div className="pointer-events-auto w-64 glass-panel rounded-2xl p-3.5 shadow-2xl">
      <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          氣象圖層控制
        </span>
        <span className="text-[10px] text-sky-400 font-mono">LAYER</span>
      </div>

      {/* 圖層選擇格 */}
      <div className="grid grid-cols-2 gap-1.5">
        {MODES.map((m) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onModeChange(m.key)}
              className={`group flex flex-col items-start rounded-xl p-2 text-left transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] border border-sky-400/30"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-sm">{m.icon}</span>
                <span>{m.label}</span>
              </div>
              <span
                className={`mt-0.5 text-[10px] leading-none ${
                  active ? "text-sky-100" : "text-slate-400"
                }`}
              >
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 開關切換選項 */}
      <div className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
        <SwitchToggle
          label="縣市行政界線"
          checked={showCounties}
          onChange={onToggleCounties}
        />

        {mode === "temperature" && (
          <SwitchToggle
            label="測站氣溫數值"
            checked={showTempLabels}
            onChange={onToggleTempLabels}
          />
        )}

        {mode === "wind" && (
          <SwitchToggle
            label="測站風向箭頭"
            checked={showWindStations}
            onChange={onToggleWindStations}
          />
        )}
      </div>

      {/* 底圖切換 */}
      <div className="mt-3 border-t border-white/10 pt-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>底圖主題</span>
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/60 p-1 border border-white/5">
          <button
            onClick={() => onBasemapChange("dark")}
            className={`rounded-lg py-1.5 text-xs font-medium transition ${
              basemap === "dark"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌙 極深灰
          </button>
          <button
            onClick={() => onBasemapChange("osm")}
            className={`rounded-lg py-1.5 text-xs font-medium transition ${
              basemap === "osm"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🗺️ 街道圖
          </button>
        </div>
      </div>

      {/* 定位按鈕 */}
      <button
        onClick={onLocate}
        disabled={locating}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all duration-200 hover:from-emerald-400 hover:to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-[0.98] disabled:opacity-60"
      >
        <span className="text-sm">📍</span>
        <span>{locating ? "正在精確定位…" : "定位我的所在縣市"}</span>
      </button>
    </div>
  );
}
