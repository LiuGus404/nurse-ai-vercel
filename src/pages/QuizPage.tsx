import React from 'react';
export default function QuizPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800 pb-20">
      <h2 className="text-xl font-bold mb-2">小測驗</h2>
      <img src="/quiz.png" alt="小測驗" className="w-16 h-16 mx-auto mb-2" />
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
        <div className="mb-2">你可以進行自我評量，檢視學習成效：</div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxQtMDm7-ItDQYkjKlZ5AM7d19lbah2x8-KULy2a1mk4f5uw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-black text-black bg-white px-4 py-2 rounded text-sm hover:bg-gray-100 text-center w-full"
        >
          前往小測驗 Google 表單
        </a>
      </div>
    </div>
  );
} 