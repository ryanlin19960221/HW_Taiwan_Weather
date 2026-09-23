"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type {
  LayerKey,
  Typhoon,
  TyphoonApiResponse,
  WeatherApiResponse,
} from "@/lib/types";
import { buildTyphoonTimeline } from "@/lib/typhoonFrames";
import WeatherLayerControl from "@/components/WeatherLayerControl";
import WeatherSummaryPanel from "@/components/WeatherSummaryPanel";
import WeatherLegend from "@/components/WeatherLegend";
import WarningBanner from "@/components/WarningBanner";
import MobileControls from "@/components/MobileControls";
import RadarControl from "@/components/RadarControl";
import TyphoonTimeline from "@/components/TyphoonTimeline";

// Leaflet 依賴 window，需關閉 SSR。
const WeatherMap = dynamic(() => import("@/components/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-gray-400">
      地圖載入中…
    </div>
  ),
});

interface UserLoc {
  lat: number;
  lng: number;
}

export default function Home() {
  const [meta, setMeta] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<LayerKey>("temperature");
  const [basemap, setBasemap] = useState<"dark" | "osm">("dark");
  const [showCounties, setShowCounties] = useState(true);
  const [showWindStations, setShowWindStations] = useState(false);
  const [showTempLabels, setShowTempLabels] = useState(true);

  // 雷達回波是獨立圖層（與氣溫/雨量互斥），選到它才啟用雷達動畫。
  const showRadar = mode === "radar";
  // 颱風路徑同樣是獨立圖層。
  const showTyphoon = mode === "typhoon";

  const [typhoons, setTyphoons] = useState<Typhoon[] | null>(null);
  const [typhoonLoaded, setTyphoonLoaded] = useState(false);
  // 颱風時間軸：目前顯示時刻（unix ms）與播放狀態。
  const [typhoonTime, setTyphoonTime] = useState<number | null>(null);
  const [typhoonPlaying, setTyphoonPlaying] = useState(false);
  const typhoonTimeline = useMemo(
    () => buildTyphoonTimeline(showTyphoon ? typhoons : null),
    [showTyphoon, typhoons]
  );

  // 雷達動畫
  const [radarData, setRadarData] = useState<{
    host: string;
    frames: { time: number; path: string }[];
  } | null>(null);
  const [radarIdx, setRadarIdx] = useState(0);
  const [radarPlaying, setRadarPlaying] = useState(false);

  const [userLocation, setUserLocation] = useState<UserLoc | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/weather/current");
      const json = (await res.json().catch(() => null)) as WeatherApiResponse | null;
      if (!res.ok || !json?.success) {
        // 502/503 代表後端與氣象署連線失敗或服務暫停，不把原始錯誤字串顯示給使用者。
        if (res.status === 502 || res.status === 503) {
          throw new Error("氣象資料服務暫時無法使用，請稍後再試。");
        }
        throw new Error(json?.error || `伺服器回應 ${res.status}`);
      }
      setMeta(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // 開啟颱風圖層時抓取官方分析與預報路徑。
  useEffect(() => {
    if (!showTyphoon) return;
    let cancelled = false;
    setTyphoonLoaded(false);
    fetch("/api/typhoon", { cache: "no-store" })
      .then((r) => r.json() as Promise<TyphoonApiResponse>)
      .then((j) => {
        if (cancelled) return;
        setTyphoons(j.success ? j.typhoons : []);
        setTyphoonLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setTyphoons([]);
        setTyphoonLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showTyphoon]);

  // 開啟雷達時抓取影格清單（過去約 2 小時、每 10 分鐘一張）。
  useEffect(() => {
    if (!showRadar) return;
    let cancelled = false;
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((r) => r.json())
      .then((j) => {
        const past: { time: number; path: string }[] = j?.radar?.past ?? [];
        if (!cancelled && j.host && past.length) {
          setRadarData({ host: j.host, frames: past });
          setRadarIdx(past.length - 1); // 停在最新一張，預設不播放
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [showRadar]);

  // 播放：循環切換影格。
  useEffect(() => {
    if (!showRadar || !radarPlaying || !radarData) return;
    const frameCount = radarData.frames.length;
    const timer = setInterval(() => {
      setRadarIdx((i) => (i + 1) % frameCount);
    }, 600);
    return () => clearInterval(timer);
  }, [showRadar, radarPlaying, radarData]);

  // 時間軸資料更新時，落點回到「現在」（目前中心）並停止播放。
  useEffect(() => {
    setTyphoonPlaying(false);
    setTyphoonTime(typhoonTimeline ? typhoonTimeline.tCurrent : null);
  }, [typhoonTimeline]);

  // 颱風播放：以連續時間平滑前進，整段約 14 秒跑完後循環。
  useEffect(() => {
    if (!typhoonPlaying || !typhoonTimeline) return;
    const { tMin, tMax } = typhoonTimeline;
    const span = tMax - tMin;
    if (span <= 0) return;
    const stepMs = 80;
    const inc = (span * stepMs) / 14000;
    const timer = setInterval(() => {
      setTyphoonTime((t) => {
        const next = (t ?? tMin) + inc;
        return next > tMax ? tMin : next;
      });
    }, stepMs);
    return () => clearInterval(timer);
  }, [typhoonPlaying, typhoonTimeline]);

  const handleLocate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocateMsg("此瀏覽器不支援定位功能");
      return;
    }
    setLocating(true);
    setLocateMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocateMsg(null);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocateMsg(
          err.code === err.PERMISSION_DENIED
            ? "已拒絕定位權限，可於瀏覽器設定開啟"
            : "無法取得您的位置"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* 地圖層 */}
      <div className="absolute inset-0">
        {meta && (
          <WeatherMap
            data={meta.data}
            mode={mode}
            basemap={basemap}
            showCounties={showCounties}
            showWindStations={showWindStations}
            showTempLabels={showTempLabels}
            radar={
              showRadar && radarData
                ? {
                    host: radarData.host,
                    frames: radarData.frames,
                    idx: radarIdx,
                  }
                : null
            }
            typhoons={showTyphoon ? typhoons : null}
            typhoonTime={showTyphoon ? typhoonTime : null}
            userLocation={userLocation}
          />
        )}
      </div>

      {/* 載入 / 錯誤覆蓋層 */}
      {loading && !meta && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel flex flex-col items-center gap-3.5 rounded-2xl px-8 py-6 text-slate-200 shadow-2xl border border-white/15">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-400 border-t-transparent shadow-[0_0_15px_rgba(56,189,248,0.6)]" />
            <div className="text-sm font-bold tracking-wide text-white">
              正在取得中央氣象署即時觀測資料…
            </div>
            <div className="text-xs text-slate-400">
              即時計算 362 站 IDW 連續填色場與 NOAA 粒子風場
            </div>
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-sm rounded-2xl p-6 text-center shadow-2xl border border-rose-500/30">
            <div className="mb-2 text-3xl">⚠️</div>
            <div className="mb-1 text-base font-bold text-white">
              暫時無法連線氣象資料
            </div>
            <div className="mb-4 text-xs text-slate-300">{error}</div>
            <button
              onClick={loadWeather}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-blue-500"
            >
              重新連線
            </button>
          </div>
        </div>
      )}

      {/* 頂部中央：天氣特報橫幅（NCDR CAP 爬蟲成果） */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-[900] flex -translate-x-1/2 justify-center">
        <WarningBanner />
      </div>

      {/* 左上：摘要面板（桌機） */}
      {meta && (
        <div className="absolute left-4 top-4 z-[900] hidden flex-col gap-3 md:flex">
          <WeatherSummaryPanel meta={meta} />
        </div>
      )}

      {/* 右上：圖層控制（桌機） */}
      <div className="absolute right-4 top-4 z-[900] hidden flex-col items-end gap-3 md:flex">
        <WeatherLayerControl
          mode={mode}
          onModeChange={setMode}
          basemap={basemap}
          onBasemapChange={setBasemap}
          showCounties={showCounties}
          onToggleCounties={setShowCounties}
          showWindStations={showWindStations}
          onToggleWindStations={setShowWindStations}
          showTempLabels={showTempLabels}
          onToggleTempLabels={setShowTempLabels}
          onLocate={handleLocate}
          locating={locating}
        />
        {locateMsg && !userLocation && (
          <div className="pointer-events-auto max-w-[224px] rounded-md bg-amber-500/20 px-3 py-2 text-xs text-amber-200">
            {locateMsg}
          </div>
        )}
      </div>

      {/* 右下：圖例（桌機） */}
      <div className="absolute bottom-4 right-4 z-[900] hidden md:block">
        <WeatherLegend mode={mode} />
      </div>

      {/* 颱風時間軸：有颱風時顯示可播放時間軸；無颱風時提示 */}
      {showTyphoon && typhoonTimeline && typhoonTime !== null && (
        <TyphoonTimeline
          timeline={typhoonTimeline}
          time={typhoonTime}
          playing={typhoonPlaying}
          onTogglePlay={() => setTyphoonPlaying((p) => !p)}
          onSeek={(t) => {
            setTyphoonPlaying(false);
            setTyphoonTime(t);
          }}
        />
      )}
      {showTyphoon && typhoonLoaded && !typhoonTimeline && (
        <div className="pointer-events-none absolute bottom-[132px] left-1/2 z-[900] flex w-[min(92vw,460px)] -translate-x-1/2 justify-center md:bottom-8">
          <div className="pointer-events-auto rounded-lg bg-panel px-4 py-2.5 text-sm text-gray-300 shadow-lg backdrop-blur">
            🌀 目前中央氣象署無正在追蹤的颱風
          </div>
        </div>
      )}

      {/* 底部中央：雷達動畫播放控制（手機上移，避開底部控制列） */}
      {showRadar && radarData && (
        <RadarControl
          frames={radarData.frames}
          idx={radarIdx}
          playing={radarPlaying}
          onTogglePlay={() => setRadarPlaying((p) => !p)}
          onSeek={(i) => {
            setRadarPlaying(false);
            setRadarIdx(i);
          }}
        />
      )}

      {/* 左下：即時連線與資料更新面板（桌機） */}
      {meta && (
        <div className="absolute bottom-4 left-4 z-[900] hidden jojo-panel rounded-2xl px-4 py-2.5 text-xs shadow-2xl md:block">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-sm">★</span>
              <span className="font-black text-amber-300">台灣即時氣象-林丞斌</span>
            </div>
            <div className="h-3 w-px bg-amber-400/40" />
            <div className="text-slate-200">
              觀測：
              <span className="font-mono font-bold text-amber-300 ml-1">
                {new Date(meta.updatedAt).toLocaleString("zh-TW", { hour12: false })}
              </span>
            </div>
            <button
              onClick={loadWeather}
              className="jojo-btn ml-2 flex items-center gap-1.5 rounded-xl px-3 py-1 font-black text-amber-300 transition active:scale-95"
            >
              <span className={loading ? "animate-spin" : ""}>⚡</span>
              <span>替身同步 (重新整理)</span>
            </button>
          </div>
        </div>
      )}

      {/* 手機版控制層（md 以下） */}
      {meta && (
        <MobileControls
          meta={meta}
          mode={mode}
          onModeChange={setMode}
          basemap={basemap}
          onBasemapChange={setBasemap}
          showCounties={showCounties}
          onToggleCounties={setShowCounties}
          showWindStations={showWindStations}
          onToggleWindStations={setShowWindStations}
          showTempLabels={showTempLabels}
          onToggleTempLabels={setShowTempLabels}
          onLocate={handleLocate}
          locating={locating}
          locateMsg={locateMsg}
          userLocation={userLocation}
          onRefresh={loadWeather}
        />
      )}
    </main>
  );
}
