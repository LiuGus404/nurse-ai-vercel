import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen pb-20">
      <main>{children}</main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-3 z-50">
        <a href="/" className="flex flex-col items-center text-sm text-gray-700">
          <img src="/home.png" alt="主頁" className="w-8 h-8 mb-1" />
          <span>主頁</span>
        </a>
        <a href="/videos" className="flex flex-col items-center text-sm text-gray-700">
          <img src="/video.png" alt="教學影片" className="w-8 h-8 mb-1" />
          <span>教學影片</span>
        </a>
        <a href="/guide" className="flex flex-col items-center text-sm text-gray-700">
          <img src="/how.png" alt="使用方法" className="w-8 h-8 mb-1" />
          <span>使用方法</span>
        </a>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxQtMDm7-ItDQYkjKlZ5AM7d19lbah2x8-KULy2a1mk4f5uw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-sm text-gray-700"
        >
          <img src="/quiz.png" alt="小測驗" className="w-8 h-8 mb-1" />
          <span>小測驗</span>
        </a>
      </div>
    </div>
  );
}