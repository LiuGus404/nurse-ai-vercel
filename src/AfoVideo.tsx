import { useNavigate } from 'react-router-dom';

export default function AfoVideo() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">足踝矯形器 (AFO) 教學影片</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:underline"
        >
          ⬅ 上一頁
        </button>
      </div>
      <div className="bg-white border border-gray-300 px-4 py-3 rounded-lg shadow-sm">
        <iframe
          src="https://drive.google.com/file/d/1XdFiIJjb9lnHeRnzHzQpPGAogqGx1KjB/preview"
          width="100%"
          height="240"
          allow="autoplay"
          className="rounded"
        ></iframe>
      </div>
    </div>
  );
}