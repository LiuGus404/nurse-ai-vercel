import { useState, useRef, useEffect } from 'react';

function flattenObject(obj: any, prefix = ''): string[] {
  const lines: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      lines.push(...flattenObject(value, path));
    } else {
      lines.push(`${path}: ${value}`);
    }
  }
  return lines;
}

function App() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; image?: string }[]>([{
    sender: 'bot',
    text: '你好！有甚麼有關 AFO（足踝矯形器）或 Hinge Knee Brace（活動式膝關節支架） 的問題都可以向我查詢！',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<'wear' | 'care' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    if (showCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.error('無法播放相機影片：', err);
            });
            setCameraError('');
          }
        })
        .catch(err => {
          console.error('相機啟動失敗:', err);
          setCameraError('無法啟動相機，請確認已允許瀏覽器存取相機。');
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera, facingMode]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    setShowCamera(false);
    setTimeout(() => setShowCamera(true), 100);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setPhotoPreview(null);
  };

  // 其餘程式碼保持不變直到相機 UI 區域內插入以下：
  // 在 {!photoPreview && ( <>) 區塊中插入以下按鈕：
  // 於 video 與 canvas 之後插入
  // 即：<video ... />
  //      <canvas ... />
  //   → 插入這段：
  //      <div className="flex gap-2">
  //        <button ... 切換鏡頭>
  //        <button ... 關閉鏡頭>
  //      </div>
  // 然後繼續接著「拍照」按鈕即可

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-4">AI智能護士</h1>
      <div className="flex justify-end gap-2">
        <button onClick={() => setShowHelp('wear')} className="text-sm text-gray-700 hover:underline">如何戴？</button>
        <button onClick={() => setShowHelp('care')} className="text-sm text-gray-700 hover:underline">如何護理？</button>
      </div>

      {showHelp && (
        <div className="border p-3 rounded bg-white shadow text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{showHelp === 'wear' ? '如何戴？' : '如何護理？'}</span>
            <button onClick={() => setShowHelp(null)} className="text-xs text-gray-500 hover:text-black">關閉</button>
          </div>
          <p>
            {showHelp === 'wear'
              ? '這裡可以說明如何正確配戴輔具，例如清潔手部、角度、緊度等建議...'
              : '這裡可以提供護理建議，例如如何清潔、更換、注意紅腫、何時聯絡醫療人員...'}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2 border rounded-xl bg-neutral-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white' : 'bg-gray-200'}`}>
            {msg.image && <img src={msg.image} alt="上傳圖片" className="mb-2 rounded border" width={240} />}
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="輸入訊息..."
        />
        <button className="border border-black text-black bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={sendMessage} disabled={loading}>
          {loading ? '傳送中…' : '發送'}
        </button>
        <label className="border border-gray-400 bg-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-100">
          上傳相片
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="space-y-2">
        {!showCamera && (
          <button className="border border-black text-black bg-white rounded px-4 py-1 text-sm hover:bg-gray-100" onClick={() => setShowCamera(true)}>
            啟動相機
          </button>
        )}
        {cameraError && <p className="text-red-500 text-sm">{cameraError}</p>}
        {showCamera && !cameraError && (
          <div className="space-y-2">
            {!photoPreview && (
              <>
                <video ref={videoRef} width="320" height="240" className="border" autoPlay muted playsInline />
                <canvas ref={canvasRef} width="320" height="240" hidden />
                <div className="flex gap-2">
                  <button className="border border-gray-500 text-gray-700 bg-white px-3 py-1 rounded text-sm hover:bg-gray-100" onClick={toggleCamera}>
                    切換鏡頭
                  </button>
                  <button className="border border-gray-300 text-gray-600 bg-white px-3 py-1 rounded text-sm hover:bg-gray-100" onClick={closeCamera}>
                    關閉鏡頭
                  </button>
                </div>
                <button className="border border-black bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-100" onClick={takePhoto} disabled={loading}>
                  拍照
                </button>
              </>
            )}
            {photoPreview && (
              <div className="space-y-2">
                <img src={photoPreview} alt="preview" className="border rounded" width={320} height={240} />
                <div className="flex gap-2">
                  <button className="border border-black text-black bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={confirmPhoto} disabled={loading}>
                    確認送出
                  </button>
                  <button className="border border-gray-500 text-gray-700 bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={cancelPhoto} disabled={loading}>
                    重拍
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 text-center">
        <a
          href="https://forms.gle/WGa6u65LAT3PLmVm9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-black text-black bg-white px-4 py-2 rounded text-sm hover:bg-gray-100 text-center w-full"
        >
          按此進行小測驗
        </a>
      </div>
    </div>
  );
}

export default App;
