"use client";

import React, { useState } from "react";
import { assetUrl } from "@/lib/basePath";
import type { LayerKey } from "@/lib/types";

export interface JojoCharacter {
  id: string;
  name: string;
  jpName: string;
  stand: string;
  standJp: string;
  avatar: string;
  layerKey?: LayerKey;
  catchphrase: string;
  weatherQuote: string;
  analysis: string;
  themeColor: string;
  badgeBorder: string;
}

export const JOJO_CHARACTERS: JojoCharacter[] = [
  {
    id: "jotaro",
    name: "空條承太郎",
    jpName: "空条 承太郎",
    stand: "白金之星 (Star Platinum)",
    standJp: "スタープラチナ",
    avatar: "/images/jojo/jotaro.jpg",
    layerKey: "temperature",
    catchphrase: "やれやれだぜ...（真是不省心）",
    weatherQuote: "全台 362 個觀測站的氣壓與溫濕度，白金之星只需 0.1 秒就能全數看穿！",
    analysis: "當前各測站數據回報極為穩定，精密性 A 級的觀測眼，哪怕是 0.1°C 的異常微溫也休想瞞過我的替身！",
    themeColor: "from-indigo-600 to-purple-800",
    badgeBorder: "border-indigo-400",
  },
  {
    id: "dio",
    name: "迪奧·布蘭度",
    jpName: "DIO",
    stand: "世界 (The World)",
    standJp: "ザ・ワールド",
    avatar: "/images/jojo/dio.jpg",
    catchphrase: "WRYYYYYY！這就是支配全島氣候的力量！",
    layerKey: "stations",
    weatherQuote: "人類的氣象預報是有極限的！只要我發動「世界」，哪怕是暴風暴雨也必須停止！",
    analysis: "俯瞰這座島嶼吧！不管是熱帶對流還是鋒面低壓，在世界的時停支配面前都不過是微不足道的塵埃！",
    themeColor: "from-amber-500 to-yellow-600",
    badgeBorder: "border-amber-400",
  },
  {
    id: "giorno",
    name: "喬魯諾·喬巴拿",
    jpName: "ジョルノ・ジョバァーナ",
    stand: "黃金體驗・黃金之風",
    standJp: "ゴールド・エクスペリエンス",
    avatar: "/images/jojo/giorno.jpg",
    layerKey: "wind",
    catchphrase: "我喬魯諾·喬巴拿有一個夢想！",
    weatherQuote: "吹拂過島嶼的每一道動態風場，都是賜予大地生命的黃金之風！",
    analysis: "無用無用無用！這點太平洋微風可吹不熄黃金精神！看那 GFS 粒子在海峽間精準躍動的生命軌跡！",
    themeColor: "from-pink-500 to-amber-500",
    badgeBorder: "border-pink-400",
  },
  {
    id: "joseph",
    name: "喬瑟夫·喬斯達",
    jpName: "ジョセフ・ジョースター",
    stand: "隱者之紫 (Hermit Purple)",
    standJp: "ハーミットパープル",
    avatar: "/images/jojo/joseph.jpg",
    layerKey: "radar",
    catchphrase: "OH MY GOD！這片雷雨雲胞是敵人的替身攻擊嗎？！",
    weatherQuote: "只要將波紋注入氣象雷達，隱者之紫就能念寫預知未來兩小時的對流發展！",
    analysis: "你下一句要說的是：「快收衣服、出門記得帶傘！」對吧？！雷達回波已經被我的隱者之紫徹底透析了！",
    themeColor: "from-purple-600 to-fuchsia-700",
    badgeBorder: "border-purple-400",
  },
  {
    id: "avdol",
    name: "穆罕默德·阿布德爾",
    jpName: "モハメド・アヴドゥル",
    stand: "烈焰魔術師 (Magician's Red)",
    standJp: "マジシャンズレッド",
    avatar: "/images/jojo/avdol.jpg",
    layerKey: "temperature",
    catchphrase: "YES! I AM! 紅色魔術師的烈焰，支配全島氣溫！",
    weatherQuote: "看那南台灣綻放的紅橘色熱浪，正是烈焰魔術師的十字火焰風暴！",
    analysis: "這可不是普通的氣溫上升，而是真正的熱力覺醒！紫外線與高溫雙重夾擊，出門必須做好萬全防護！",
    themeColor: "from-red-600 to-orange-600",
    badgeBorder: "border-red-400",
  },
  {
    id: "kakyoin",
    name: "花京院典明",
    jpName: "花京院 典明",
    stand: "綠之法皇 (Hierophant Green)",
    standJp: "ハイエロファントグリーン",
    avatar: "/images/jojo/kakyoin.jpg",
    layerKey: "precipitation",
    catchphrase: "半徑 20 公尺的綠寶石水花！這就是豪雨量測結界！",
    weatherQuote: "法皇的觸手已探入每條積雨雲，累積降雨柱狀刻度正急速上升！",
    analysis: "無人能躲開 20 公尺的綠寶石水花！即時降雨數據已完全鎖定，山區與迎風面請務必提防強降雨！",
    themeColor: "from-emerald-600 to-teal-700",
    badgeBorder: "border-emerald-400",
  },
  {
    id: "josuke",
    name: "東方仗助",
    jpName: "東方 仗助",
    stand: "瘋狂鑽石 (Crazy Diamond)",
    standJp: "クレイジー・ダイヤモンド",
    avatar: "/images/jojo/josuke.jpg",
    layerKey: "weather",
    catchphrase: "超～令人火大啊！若是誰敢嫌棄這天氣，我絕不饒他！",
    weatherQuote: "無論今天天氣多悶熱潮濕，瘋狂鑽石的修復之力都能幫你瞬間滿血回復！",
    analysis: "GREAT 啦！透過環境舒適度分析，適當吹冷氣、補充水分，就能把疲憊的身體回復到最完美狀態！",
    themeColor: "from-cyan-500 to-blue-600",
    badgeBorder: "border-cyan-400",
  },
];

interface Props {
  currentLayer: LayerKey;
  onSelectLayer: (layer: LayerKey) => void;
}

export default function JojoCompanion({ currentLayer, onSelectLayer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeChar = JOJO_CHARACTERS[activeIdx];

  return (
    <>
      {/* 浮動開啟按鈕 (桌面與行動端均可見) */}
      <button
        onClick={() => setIsOpen(true)}
        className="jojo-action-btn flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl transition-all duration-300 group"
        title="開啟 JOJO 替身使者氣象圖鑑"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-amber-300 shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl("/images/jojo/jotaro.jpg")}
            alt="Jojo"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-amber-300 tracking-widest leading-none">
            STAND ROSTER
          </div>
          <div className="text-xs font-black text-white tracking-wider">
            替身使者氣象圖鑑
          </div>
        </div>
        <span className="text-amber-400 text-sm font-black animate-pulse">★</span>
      </button>

      {/* 角色彈窗 / 側邊抽屜 */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl jojo-panel rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-amber-400/80 max-h-[90vh] overflow-y-auto">
            {/* 關閉按鈕 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-500 text-white font-black text-base flex items-center justify-center border-2 border-amber-300 shadow transition-transform hover:scale-110"
              title="關閉"
            >
              ✕
            </button>

            {/* 標題欄 */}
            <div className="flex items-center gap-3 mb-5 border-b-2 border-amber-400/40 pb-3">
              <span className="text-amber-400 text-2xl font-black">⚡</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-wider">
                  JOJO 替身使者氣象作戰部隊
                </h2>
                <p className="text-[11px] text-purple-200/80 font-medium">
                  點擊各角色查看其專屬替身氣象分析，並可直接呼叫替身啟動圖層！
                </p>
              </div>
            </div>

            {/* 角色頭像列 (橫向滾動選擇) */}
            <div className="flex gap-2.5 overflow-x-auto pb-3 mb-4 scrollbar-thin scrollbar-thumb-amber-400/30">
              {JOJO_CHARACTERS.map((char, idx) => {
                const isSelected = idx === activeIdx;
                return (
                  <button
                    key={char.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex flex-col items-center gap-1 min-w-[70px] sm:min-w-[80px] p-2 rounded-2xl transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-amber-400/20 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105"
                        : "bg-purple-950/40 border-purple-800/40 hover:border-amber-400/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300/80 shadow">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={assetUrl(char.avatar)}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-black text-white whitespace-nowrap">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 主選中角色詳細卡片 */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-4 sm:p-6 border-2 border-amber-400/50 shadow-inner">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* 角色大立繪圖 */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-[0_8px_25px_rgba(0,0,0,0.8)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={assetUrl(activeChar.avatar)}
                    alt={activeChar.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-sm py-1 text-center">
                    <span className="text-[10px] font-black text-amber-300 tracking-wider">
                      {activeChar.standJp}
                    </span>
                  </div>
                </div>

                {/* 角色資訊與台詞 */}
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {activeChar.name}
                      </span>
                      <span className="text-xs font-bold text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
                        {activeChar.jpName}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-amber-400 mt-1">
                      替身：{activeChar.stand}
                    </div>
                  </div>

                  {/* 經典台詞對話氣泡 */}
                  <div className="relative bg-black/60 border border-purple-500/40 rounded-2xl p-3 shadow text-xs">
                    <div className="font-black text-amber-300 mb-1 flex items-center gap-1.5">
                      <span>💬 名言：</span>
                      <span className="italic">「{activeChar.catchphrase}」</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {activeChar.weatherQuote}
                    </p>
                  </div>

                  {/* 氣象使者分析 */}
                  <div className="bg-purple-900/30 border border-amber-400/20 rounded-xl p-3 text-[11px] sm:text-xs text-purple-100/90 leading-relaxed">
                    <span className="font-bold text-amber-300 mr-1.5">【使者氣象透析】</span>
                    {activeChar.analysis}
                  </div>

                  {/* 呼叫替身按鈕 */}
                  {activeChar.layerKey && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          if (activeChar.layerKey) {
                            onSelectLayer(activeChar.layerKey);
                            setIsOpen(false);
                          }
                        }}
                        className="jojo-btn w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-black text-white tracking-widest flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>發動替身！切換至對應氣象圖層</span>
                        <span className="text-amber-400">➜</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 底部 JOJO 經典紋章文字 */}
            <div className="mt-4 flex justify-between items-center text-[10px] font-black text-purple-300/60 uppercase tracking-widest px-1">
              <span>JOJO&apos;S BIZARRE WEATHER SYSTEM</span>
              <span>STAND POWER: OVER DRIVE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
