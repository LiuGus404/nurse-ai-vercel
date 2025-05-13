import React from 'react';
export default function TutorialVideos() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800 pb-20">
      <h2 className="text-xl font-bold mb-2">教學影片</h2>
      <img src="/video.png" alt="教學影片" className="w-16 h-16 mx-auto mb-2" />
      <div className="grid gap-4">
        <a href="/knee-brace-video" className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-md p-4 transition">
          <div className="font-semibold text-lg mb-1">活動式膝關節支架</div>
          <div className="text-sm text-gray-600">觀看如何正確使用活動式膝關節支架的教學影片。</div>
        </a>
        <a href="/afo-video" className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-md p-4 transition">
          <div className="font-semibold text-lg mb-1">足踝矯形器</div>
          <div className="text-sm text-gray-600">觀看如何正確使用足踝矯形器的教學影片。</div>
        </a>
      </div>
    </div>
  );
} 