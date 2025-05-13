import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen pb-16">
      <main>{children}</main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50">
        <a href="/" className="flex flex-col items-center text-xs text-gray-700">
          <span>💬</span>
          <span>主頁</span>
        </a>
        <a href="/videos" className="flex flex-col items-center text-xs text-gray-700">
          <span>🎬</span>
          <span>教學影片</span>
        </a>
        <a href="/guide" className="flex flex-col items-center text-xs text-gray-700">
          <span>📘</span>
          <span>使用方法</span>
        </a>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxQtMDm7-ItDQYkjKlZ5AM7d19lbah2x8-KULy2a1mk4f5uw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-xs text-gray-700"
        >
          <span>📝</span>
          <span>小測驗</span>
        </a>
      </div>
    </div>
  );
}