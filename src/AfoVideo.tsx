import { useNavigate } from 'react-router-dom';

export default function AfoVideo() {
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
      <h1 className="text-lg font-semibold mb-4">足踝矯形器 (AFO) 教學影片</h1>
      <div className="rounded overflow-hidden mb-4">
        <iframe
          src="https://drive.google.com/file/d/1EfKolGuzar-b8DF5HOPNCNIvl8eAY_Vb/preview"
          width="100%"
          height="240"
          allow="autoplay"
          className="rounded"
        ></iframe>
      </div>
    </div>
  );
}