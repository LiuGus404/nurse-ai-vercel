import { useNavigate } from 'react-router-dom';

export default function KneeBraceVideo() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:underline"
        >
          ⬅ 上一頁
        </button>
      </div>
      <h1 className="text-lg font-semibold mb-4">活動式膝關節支架 (Hinge Knee Brace) 教學影片</h1>
      <div className="rounded overflow-hidden mb-4">
        <iframe
          src="https://drive.google.com/file/d/19vh2iX3xDK_HnEmhjiVy1TXkd_wHfYDn/preview"
          width="100%"
          height="240"
          allow="autoplay"
          className="rounded"
        ></iframe>
      </div>
    </div>
  );
}