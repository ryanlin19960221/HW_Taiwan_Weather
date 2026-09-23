import type { WeatherFeatureCollection, WeatherFeature, CachedWeather } from "./types";
import { buildSummary } from "./weather-summary";

interface BaseStationConfig {
  id: string;
  name: string;
  county: string;
  town: string;
  lng: number;
  lat: number;
  baseTemp: number;
  baseHumidity: number;
  windSpeed: number;
  windDirection: number;
  weather: string;
  precipitation: number;
}

const BASE_STATIONS: BaseStationConfig[] = [
  { id: "466920", name: "臺北", county: "臺北市", town: "中正區", lng: 121.5148, lat: 25.0376, baseTemp: 26.5, baseHumidity: 68, windSpeed: 2.5, windDirection: 70, weather: "晴時多雲", precipitation: 0 },
  { id: "466910", name: "鞍部", county: "臺北市", town: "北投區", lng: 121.5297, lat: 25.1825, baseTemp: 21.2, baseHumidity: 85, windSpeed: 4.8, windDirection: 60, weather: "陰天", precipitation: 0.5 },
  { id: "466880", name: "板橋", county: "新北市", town: "板橋區", lng: 121.4420, lat: 24.9976, baseTemp: 26.8, baseHumidity: 70, windSpeed: 2.1, windDirection: 80, weather: "多雲", precipitation: 0 },
  { id: "466900", name: "淡水", county: "新北市", town: "淡水區", lng: 121.4489, lat: 25.1648, baseTemp: 25.4, baseHumidity: 75, windSpeed: 3.8, windDirection: 50, weather: "多雲時晴", precipitation: 0 },
  { id: "466940", name: "基隆", county: "基隆市", town: "仁愛區", lng: 121.7404, lat: 25.1333, baseTemp: 25.1, baseHumidity: 78, windSpeed: 4.2, windDirection: 45, weather: "短暫陣雨", precipitation: 1.5 },
  { id: "467050", name: "新屋", county: "桃園市", town: "新屋區", lng: 121.0475, lat: 25.0067, baseTemp: 25.9, baseHumidity: 72, windSpeed: 5.1, windDirection: 40, weather: "多雲", precipitation: 0 },
  { id: "C0C480", name: "桃園", county: "桃園市", town: "桃園區", lng: 121.3129, lat: 24.9937, baseTemp: 26.2, baseHumidity: 71, windSpeed: 3.2, windDirection: 55, weather: "晴時多雲", precipitation: 0 },
  { id: "467570", name: "新竹", county: "新竹市", town: "北區", lng: 120.9741, lat: 24.8278, baseTemp: 26.5, baseHumidity: 69, windSpeed: 5.6, windDirection: 45, weather: "晴天", precipitation: 0 },
  { id: "C0D570", name: "竹東", county: "新竹縣", town: "竹東鎮", lng: 121.0864, lat: 24.7336, baseTemp: 25.8, baseHumidity: 73, windSpeed: 2.4, windDirection: 50, weather: "晴時多雲", precipitation: 0 },
  { id: "C0E420", name: "苗栗", county: "苗栗縣", town: "苗栗市", lng: 120.8242, lat: 24.5653, baseTemp: 26.7, baseHumidity: 67, windSpeed: 3.1, windDirection: 60, weather: "晴天", precipitation: 0 },
  { id: "467490", name: "臺中", county: "臺中市", town: "北區", lng: 120.6841, lat: 24.1457, baseTemp: 28.1, baseHumidity: 62, windSpeed: 2.0, windDirection: 340, weather: "晴天", precipitation: 0 },
  { id: "467770", name: "梧棲", county: "臺中市", town: "梧棲區", lng: 120.5233, lat: 24.2561, baseTemp: 26.3, baseHumidity: 74, windSpeed: 6.2, windDirection: 20, weather: "晴時多雲", precipitation: 0 },
  { id: "C0G650", name: "彰化", county: "彰化縣", town: "彰化市", lng: 120.5592, lat: 24.0754, baseTemp: 27.8, baseHumidity: 65, windSpeed: 2.8, windDirection: 10, weather: "晴天", precipitation: 0 },
  { id: "C0G660", name: "田中", county: "彰化縣", town: "田中鎮", lng: 120.5843, lat: 23.8617, baseTemp: 28.2, baseHumidity: 64, windSpeed: 2.2, windDirection: 350, weather: "晴天", precipitation: 0 },
  { id: "467650", name: "日月潭", county: "南投縣", town: "魚池鄉", lng: 120.9080, lat: 23.8814, baseTemp: 22.4, baseHumidity: 79, windSpeed: 1.5, windDirection: 180, weather: "晴時多雲", precipitation: 0 },
  { id: "467550", name: "玉山", county: "南投縣", town: "信義鄉", lng: 120.9573, lat: 23.4876, baseTemp: 8.5, baseHumidity: 88, windSpeed: 7.2, windDirection: 270, weather: "多雲", precipitation: 0 },
  { id: "C0I380", name: "埔里", county: "南投縣", town: "埔里鎮", lng: 120.9639, lat: 23.9658, baseTemp: 25.6, baseHumidity: 70, windSpeed: 1.8, windDirection: 160, weather: "晴天", precipitation: 0 },
  { id: "C0K400", name: "斗六", county: "雲林縣", town: "斗六市", lng: 120.5447, lat: 23.7144, baseTemp: 28.4, baseHumidity: 63, windSpeed: 2.1, windDirection: 330, weather: "晴天", precipitation: 0 },
  { id: "467480", name: "嘉義", county: "嘉義市", town: "西區", lng: 120.4329, lat: 23.4959, baseTemp: 28.7, baseHumidity: 64, windSpeed: 2.3, windDirection: 320, weather: "晴天", precipitation: 0 },
  { id: "467530", name: "阿里山", county: "嘉義縣", town: "阿里山鄉", lng: 120.8131, lat: 23.5082, baseTemp: 14.8, baseHumidity: 86, windSpeed: 2.1, windDirection: 210, weather: "陰時多雲", precipitation: 0.5 },
  { id: "467410", name: "臺南", county: "臺南市", town: "中西區", lng: 120.2033, lat: 22.9934, baseTemp: 29.2, baseHumidity: 66, windSpeed: 2.8, windDirection: 310, weather: "晴天", precipitation: 0 },
  { id: "467420", name: "永康", county: "臺南市", town: "永康區", lng: 120.2367, lat: 23.0383, baseTemp: 29.0, baseHumidity: 67, windSpeed: 2.5, windDirection: 300, weather: "晴天", precipitation: 0 },
  { id: "467440", name: "高雄", county: "高雄市", town: "前鎮區", lng: 120.3157, lat: 22.5660, baseTemp: 29.5, baseHumidity: 68, windSpeed: 3.4, windDirection: 290, weather: "晴天", precipitation: 0 },
  { id: "C0V640", name: "美濃", county: "高雄市", town: "美濃區", lng: 120.5367, lat: 22.8986, baseTemp: 29.1, baseHumidity: 69, windSpeed: 1.9, windDirection: 250, weather: "晴天", precipitation: 0 },
  { id: "467590", name: "恆春", county: "屏東縣", town: "恆春鎮", lng: 120.7463, lat: 22.0039, baseTemp: 28.9, baseHumidity: 76, windSpeed: 6.8, windDirection: 75, weather: "多雲短暫雨", precipitation: 2.0 },
  { id: "C0R130", name: "墾丁", county: "屏東縣", town: "恆春鎮", lng: 120.7969, lat: 21.9422, baseTemp: 28.7, baseHumidity: 78, windSpeed: 7.1, windDirection: 70, weather: "短暫陣雨", precipitation: 3.5 },
  { id: "C0R140", name: "屏東", county: "屏東縣", town: "屏東市", lng: 120.4883, lat: 22.6731, baseTemp: 29.4, baseHumidity: 67, windSpeed: 2.2, windDirection: 280, weather: "晴天", precipitation: 0 },
  { id: "467080", name: "宜蘭", county: "宜蘭縣", town: "宜蘭市", lng: 121.7565, lat: 24.7640, baseTemp: 25.5, baseHumidity: 82, windSpeed: 2.9, windDirection: 90, weather: "陰短暫雨", precipitation: 4.0 },
  { id: "467060", name: "蘇澳", county: "宜蘭縣", town: "蘇澳鎮", lng: 121.8574, lat: 24.5967, baseTemp: 25.0, baseHumidity: 84, windSpeed: 4.5, windDirection: 80, weather: "短暫陣雨", precipitation: 5.5 },
  { id: "466990", name: "花蓮", county: "花蓮縣", town: "花蓮市", lng: 121.6133, lat: 23.9751, baseTemp: 26.2, baseHumidity: 77, windSpeed: 3.5, windDirection: 60, weather: "多雲時陰", precipitation: 1.0 },
  { id: "C0T820", name: "光復", county: "花蓮縣", town: "光復鄉", lng: 121.4239, lat: 23.6689, baseTemp: 26.5, baseHumidity: 76, windSpeed: 2.4, windDirection: 70, weather: "多雲", precipitation: 0 },
  { id: "467660", name: "臺東", county: "臺東縣", town: "臺東市", lng: 121.1546, lat: 22.7522, baseTemp: 27.6, baseHumidity: 74, windSpeed: 3.8, windDirection: 50, weather: "多雲時晴", precipitation: 0 },
  { id: "467610", name: "成功", county: "臺東縣", town: "成功鎮", lng: 121.3734, lat: 23.0975, baseTemp: 26.8, baseHumidity: 78, windSpeed: 4.6, windDirection: 65, weather: "多雲", precipitation: 0.5 },
  { id: "467620", name: "蘭嶼", county: "臺東縣", town: "蘭嶼鄉", lng: 121.5583, lat: 22.0370, baseTemp: 26.4, baseHumidity: 86, windSpeed: 8.5, windDirection: 80, weather: "陰短暫陣雨", precipitation: 4.5 },
  { id: "467350", name: "澎湖", county: "澎湖縣", town: "馬公市", lng: 119.5630, lat: 23.5655, baseTemp: 26.8, baseHumidity: 73, windSpeed: 7.4, windDirection: 30, weather: "晴時多雲", precipitation: 0 },
  { id: "467300", name: "東吉島", county: "澎湖縣", town: "望安鄉", lng: 119.6672, lat: 23.2575, baseTemp: 26.6, baseHumidity: 77, windSpeed: 8.2, windDirection: 25, weather: "多雲", precipitation: 0 },
  { id: "467110", name: "金門", county: "金門縣", town: "金城鎮", lng: 118.2892, lat: 24.4073, baseTemp: 25.8, baseHumidity: 71, windSpeed: 6.5, windDirection: 45, weather: "晴天", precipitation: 0 },
  { id: "467990", name: "馬祖", county: "連江縣", town: "南竿鄉", lng: 119.9230, lat: 26.1694, baseTemp: 23.8, baseHumidity: 79, windSpeed: 7.8, windDirection: 50, weather: "多雲時陰", precipitation: 0 },
];

export function getFallbackWeather(): CachedWeather {
  const now = new Date();
  const isoTime = now.toISOString();

  const features: WeatherFeature[] = BASE_STATIONS.map((s) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [s.lng, s.lat],
    },
    properties: {
      stationId: s.id,
      stationName: s.name,
      county: s.county,
      town: s.town,
      observedAt: isoTime,
      temperature: s.baseTemp,
      humidity: s.baseHumidity,
      pressure: s.lat > 23.4 && s.baseTemp < 15 ? 780 : 1012.5,
      windSpeed: s.windSpeed,
      windDirection: s.windDirection,
      gustSpeed: Math.round((s.windSpeed * 1.5 + 1) * 10) / 10,
      precipitation: s.precipitation,
      uvi: s.weather.includes("雨") ? 1 : 6,
      weather: s.weather,
    },
  }));

  const data: WeatherFeatureCollection = {
    type: "FeatureCollection",
    updatedAt: isoTime,
    source: "中央氣象署示範測站 (未設定 CWA_API_KEY)",
    features,
  };

  const summary = buildSummary(data);

  return {
    data,
    summary,
    source: data.source,
    updatedAt: isoTime,
    fetchedAt: isoTime,
    stationCount: features.length,
  };
}
