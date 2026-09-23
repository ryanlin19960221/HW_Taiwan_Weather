import type { WeatherApiResponse, Typhoon } from "./types";
import { transformToGeoJSON } from "./weather-transform";
import { buildSummary } from "./weather-summary";
import { getFallbackWeather } from "./fallback-weather";

const CWA_API_KEY =
  process.env.NEXT_PUBLIC_CWA_API_KEY || "CWA-652E4A95-7B9A-4069-8971-B1D410717934";
const PRIMARY_DATASET =
  process.env.NEXT_PUBLIC_CWA_PRIMARY_DATASET || "O-A0003-001";

export async function fetchLiveWeather(): Promise<WeatherApiResponse> {
  const nowIso = new Date().toISOString();
  try {
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${PRIMARY_DATASET}?Authorization=${CWA_API_KEY}`;
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const json = await res.json();
      const fc = transformToGeoJSON(json, PRIMARY_DATASET);
      if (fc.features.length > 0) {
        const summary = buildSummary(fc);
        return {
          success: true,
          source: PRIMARY_DATASET,
          cached: false,
          stale: false,
          updatedAt: fc.updatedAt,
          fetchedAt: nowIso,
          stationCount: fc.features.length,
          data: fc,
          summary,
        };
      }
    }
  } catch (err) {
    console.warn("CWA live fetch failed, fallback to bundled data:", err);
  }

  // 離線或 API 異常時降級保護
  const fallback = getFallbackWeather();
  return {
    success: true,
    source: fallback.source,
    cached: true,
    stale: true,
    updatedAt: fallback.updatedAt,
    fetchedAt: nowIso,
    stationCount: fallback.stationCount,
    data: fallback.data,
    summary: fallback.summary,
  };
}

export async function fetchLiveWarnings() {
  try {
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/W-C0033-001?Authorization=${CWA_API_KEY}`;
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const json = await res.json();
      const records = json?.records?.record ?? [];
      const warnings = records.map((r: any, idx: number) => ({
        id: r.datasetInfo?.datasetDescription || String(idx),
        event: r.datasetInfo?.datasetDescription || "天氣警報",
        headline: r.contents?.content?.contentText || "請注意氣象警特報",
        effective: r.datasetInfo?.validTime?.startTime || null,
        expires: r.datasetInfo?.validTime?.endTime || null,
        updated: null,
        capUrl: null,
      }));
      return { success: true, warnings };
    }
  } catch {
    // ignore
  }
  return { success: true, warnings: [] };
}

export async function fetchLiveTyphoons(): Promise<Typhoon[]> {
  try {
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/W-C0034-005?Authorization=${CWA_API_KEY}`;
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const json = await res.json();
      const list = json?.records?.TropicalCyclones?.TropicalCyclone ?? [];
      return list
        .map((c: any, index: number) => {
          const past = (c.AnalysisData?.Fix ?? [])
            .map((f: any) => ({
              time: f.DateTime ?? null,
              tau: null,
              lng: Number(f.CoordinateLongitude),
              lat: Number(f.CoordinateLatitude),
              pressure: f.Pressure ? Number(f.Pressure) : null,
              maxWind: f.MaxWindSpeed ? Number(f.MaxWindSpeed) : null,
              gust: f.MaxGustSpeed ? Number(f.MaxGustSpeed) : null,
              radius70: null,
              stormRadius: f.Circle15ms?.Radius ? Number(f.Circle15ms.Radius) : null,
              severeRadius: f.Circle25ms?.Radius ? Number(f.Circle25ms.Radius) : null,
              moveDir: f.MovingDirection?.trim() || null,
              moveSpeed: f.MovingSpeed ? Number(f.MovingSpeed) : null,
            }))
            .filter((f: any) => Number.isFinite(f.lng) && Number.isFinite(f.lat));

          const forecast = (c.ForecastData?.Fix ?? [])
            .map((f: any) => ({
              time: f.InitialTime ?? null,
              tau: f.ForecastHour ? Number(f.ForecastHour) : null,
              lng: Number(f.CoordinateLongitude),
              lat: Number(f.CoordinateLatitude),
              pressure: f.Pressure ? Number(f.Pressure) : null,
              maxWind: f.MaxWindSpeed ? Number(f.MaxWindSpeed) : null,
              gust: f.MaxGustSpeed ? Number(f.MaxGustSpeed) : null,
              radius70: f.Radius70PercentProbability ? Number(f.Radius70PercentProbability) : null,
              stormRadius: null,
              severeRadius: null,
              moveDir: null,
              moveSpeed: null,
            }))
            .filter((f: any) => Number.isFinite(f.lng) && Number.isFinite(f.lat));

          if (past.length === 0 && forecast.length === 0) return null;
          const current = past.length > 0 ? past[past.length - 1] : null;
          const enName = c.TyphoonName?.trim() || null;
          const name = c.CwaTyphoonName?.trim() || enName || `颱風 ${index + 1}`;
          return {
            id: String(c.CwaTyNo ?? c.CwaTdNo ?? enName ?? name),
            name,
            enName,
            category: "颱風",
            past,
            current,
            forecast,
          };
        })
        .filter((t: any): t is Typhoon => t !== null);
    }
  } catch {
    //
  }
  return [];
}
