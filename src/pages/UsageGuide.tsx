import React from 'react';
export default function UsageGuide() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800 pb-20">
      <h2 className="text-xl font-bold mb-2">使用方法</h2>
      <img src="/how.png" alt="使用方法" className="w-16 h-16 mx-auto mb-2" />
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-4">
        <div>
          <span className="font-semibold block mb-1">1. 如何將本頁變成 Web App 放到手機桌面</span>
          <span className="block text-gray-700">iPhone（Safari）：點擊下方「分享」圖示 → 選擇「加入主畫面」<br/>Android（Chrome）：點右上「⋮」 → 選擇「加到主畫面」<br/>這樣就能像 App 一樣快速開啟本服務！</span>
        </div>
        <div>
          <span className="font-semibold block mb-1">2. 拍照協助識別輔具</span>
          <span className="block text-gray-700">在「主頁」(對話框) 點選「啟動相機」或「上傳相片」，即可拍攝或上傳你現時佩戴的輔具，AI 會協助判斷是 AFO（足踝矯形器）還是 Hinge Knee Brace（活動式膝關節支架）。</span>
        </div>
        <div>
          <span className="font-semibold block mb-1">3. 如何使用智能護士 Chatbot</span>
          <span className="block text-gray-700">在主頁輸入你的問題並發送，AI 護士會於 15-25 秒內回覆。如遇到困難可重新發問。<br/>所有提問內容不會被保存或記錄，保障你的私隱。</span>
        </div>
        <div>
          <span className="font-semibold block mb-1">4. 如有特別情況請諮詢醫療人員</span>
          <span className="block text-gray-700">如佩戴輔具時出現紅腫、疼痛、損傷或其他異常，請盡快聯絡你的醫療人員或治療師。</span>
        </div>
      </div>
    </div>
  );
} 