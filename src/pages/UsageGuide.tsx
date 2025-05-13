import React from 'react';
export default function UsageGuide() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800 pb-20">
      <h2 className="text-xl font-bold mb-4">使用方法</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-2">
        <div>
          <span className="font-semibold">1. 提問：</span>
          在「對話框」分頁輸入你想詢問的問題，AI護士會自動回覆你。
        </div>
        <div>
          <span className="font-semibold">2. 上傳圖片：</span>
          點選「上傳相片」或「啟動相機」即可傳送照片給AI協助判讀。
        </div>
        <div>
          <span className="font-semibold">3. 觀看教學影片：</span>
          前往「教學影片」分頁，選擇你想觀看的輔具教學。
        </div>
        <div>
          <span className="font-semibold">4. 小測驗：</span>
          在「小測驗」分頁可進行自我評量，檢視學習成效。
        </div>
      </div>
    </div>
  );
} 