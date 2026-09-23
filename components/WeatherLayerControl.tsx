"use client";

import type { LayerKey } from "@/lib/types";

export const MODES: {
  key: LayerKey;
  stand: string;
  label: string;
  icon: string;
  desc: string;
  tag: string;
}[] = [
  {
    key: "temperature",
    stand: "烈焰魔術師",
    label: "氣溫分佈",
    icon: "🔥",
    desc: "IDW 平滑填色",
    tag: "Magician's Red",
  },
  {
    key: "precipitation",
    stand: "彩虹狂風",
    label: "累積降雨",
    icon: "🌧️",
    desc: "即時連續雨場",
    tag: "Catch The Rainbow",
  },
  {
    key: "wind",
    stand: "黃金之風",
    label: "風場粒子",
    icon: "🌪️",
    desc: "NOAA GFS 動畫",
    tag: "Golden Wind",
  },
  {
    key: "radar",
    stand: "隱者之紫",
    label: "雷達念寫",
    icon: "🛰️",
    desc: "RainViewer 序列",
    tag: "Hermit Purple",
  },
  {
    key: "typhoon",
    stand: "氣候預報",
    label: "颱風軌跡",
    icon: "🌀",
    desc: "CWA 官方預報",
    tag: "Weather Report",
  },
  {
    key: "humidity",
    stand: "綠之法皇",
    label: "相對濕度",
    icon: "💧",
    desc: "水氣連續場",
    tag: "Hierophant Green",
  },
  {
    key: "weather",
    stand: "太陽降臨",
    label: "晴雨天氣",
    icon: "☀️",
    desc: "各縣市天候符號",
    tag: "The Sun",
  },
  {
    key: "stations",
    stand: "世界之眼",
    label: "測站座標",
    icon: "📍",
    desc: "362 站即時坐標",
    tag: "The World",
  },
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

function JojoSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      type="button"
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-black transition-all ${
        checked
          ? "bg-purple-900/80 border-2 border-amber-400 text-amber-300 shadow-[2px_2px_0px_#facc15]"
          : "bg-slate-900/70 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
      }`}
    >
      <span className="tracking-wider">{label}</span>
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
    <div className="pointer-events-auto w-72 jojo-panel rounded-2xl p-3.5 shadow-2xl">
      {/* 標題欄 */}
      <div className="mb-2.5 flex items-center justify-between border-b-2 border-amber-400/40 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-xs font-black italic tracking-wider text-amber-300">
            STAND POWER · 替身圖層
          </span>
        </div>
        <span className="jojo-menace text-xs">ドドド</span>
      </div>

      {/* JOJO 風格圖層按鈕網格 */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onModeChange(m.key)}
              type="button"
              className={`group flex flex-col items-start rounded-xl p-2.5 text-left ${
                active ? "jojo-btn jojo-btn-active" : "jojo-btn"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm">{m.icon}</span>
                <span
                  className={`text-[9px] font-mono uppercase tracking-tighter ${
                    active ? "text-purple-950 font-bold" : "text-amber-300/80"
                  }`}
                >
                  {m.stand}
                </span>
              </div>
              <div className="mt-1 font-black text-xs tracking-wider">
                {m.label}
              </div>
              <span
                className={`mt-0.5 text-[9px] font-medium leading-none ${
                  active ? "text-purple-900" : "text-slate-300"
                }`}
              >
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 替身屬性開關 */}
      <div className="mt-3 space-y-1.5 border-t-2 border-amber-400/30 pt-2.5">
        <JojoSwitch
          label="★ 縣市行政領域界線"
          checked={showCounties}
          onChange={onToggleCounties}
        />

        {mode === "temperature" && (
          <JojoSwitch
            label="★ 氣溫數值標籤"
            checked={showTempLabels}
            onChange={onToggleTempLabels}
          />
        )}

        {mode === "wind" && (
          <JojoSwitch
            label="★ 風場向量箭頭"
            checked={showWindStations}
            onChange={onToggleWindStations}
          />
        )}
      </div>

      {/* 底圖切換 */}
      <div className="mt-3 border-t-2 border-amber-400/30 pt-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-amber-300">
          <span>世界舞台（底圖）</span>
          <span className="text-[10px] text-purple-300 font-mono">WORLD MAP</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-purple-950/80 p-1 border-2 border-purple-700">
          <button
            type="button"
            onClick={() => onBasemapChange("dark")}
            className={`rounded-lg py-1.5 text-xs font-black transition-all ${
              basemap === "dark"
                ? "bg-amber-400 text-purple-950 shadow-[2px_2px_0px_#9333ea]"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            🌑 黑暗暗殺隊
          </button>
          <button
            type="button"
            onClick={() => onBasemapChange("osm")}
            className={`rounded-lg py-1.5 text-xs font-black transition-all ${
              basemap === "osm"
                ? "bg-amber-400 text-purple-950 shadow-[2px_2px_0px_#9333ea]"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            🏙️ 杜王町街景
          </button>
        </div>
      </div>

      {/* JOJO 風格定位按鈕 */}
      <button
        onClick={onLocate}
        disabled={locating}
        type="button"
        className="jojo-action-btn mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black shadow-lg disabled:opacity-60"
      >
        <span className="text-sm">🧭</span>
        <span>
          {locating
            ? "替身搜索中… ゴゴゴ"
            : "替身感知！定位我的座標 ドドド"}
        </span>
      </button>
    </div>
  );
}
