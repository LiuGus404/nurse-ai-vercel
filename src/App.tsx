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
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    if (showCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
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
  }, [showCamera]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://liugus.app.n8n.cloud/webhook/c56c0eb1-fc53-4264-b29c-6ca0b4e51aa6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      let replyText = '無回應';

      if (typeof data === 'object' && 'reply' in data) {
        replyText = data.reply;
      } else if (typeof data === 'string') {
        replyText = data;
      } else if (typeof data === 'object') {
        replyText = flattenObject(data).join('\n');
      }

      const botMessage = { sender: 'bot', text: replyText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: '發生錯誤，請稍後再試。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const takePhoto = () => {
    console.log('📸 拍照按下了');
    if (!canvasRef.current || !videoRef.current) {
      console.error('📷 video 或 canvas 未準備好');
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) {
      console.error('⚠️ 無法取得 canvas context');
      return;
    }

    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const imageData = canvasRef.current.toDataURL('image/png');
    console.log('📸 已拍下 base64 圖片');
    setPhotoPreview(imageData);
  };

  const confirmPhoto = async () => {
    if (!photoPreview) return;
    setMessages((prev) => [...prev, { sender: 'user', text: '[已拍照]' }]);
    setLoading(true);

    const payload = new FormData();
    payload.append('image', photoPreview);

    try {
      const response = await fetch('https://liugus.app.n8n.cloud/webhook/c56c0eb1-fc53-4264-b29c-6ca0b4e51aa6', {
        method: 'POST',
        body: payload
      });
      const data = await response.json();

      let replyText = '無回應';
      if (typeof data === 'object' && 'reply' in data) {
        replyText = data.reply;
      } else if (typeof data === 'string') {
        replyText = data;
      } else if (typeof data === 'object') {
        replyText = flattenObject(data).join('\n');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
      setShowCamera(false);
      setPhotoPreview(null);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: '拍照送出時發生錯誤' }]);
    } finally {
      setLoading(false);
    }
  };

  const cancelPhoto = () => {
    setPhotoPreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">AI智能護士</h1>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2 border rounded-xl bg-neutral-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white' : 'bg-gray-200'}`}>
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="輸入訊息..."
        />
        <button className="bg-blue-500 text-white rounded px-4" onClick={sendMessage} disabled={loading}>
          {loading ? '傳送中…' : '發送'}
        </button>
      </div>
      <div className="space-y-2">
        {!showCamera && (
          <button className="bg-green-600 text-white rounded px-4 py-1" onClick={() => setShowCamera(true)}>
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
                <button className="bg-purple-500 text-white rounded px-4 py-1" onClick={takePhoto} disabled={loading}>
                  拍照
                </button>
              </>
            )}
            {photoPreview && (
              <div className="space-y-2">
                <img src={photoPreview} alt="preview" className="border rounded" width={320} height={240} />
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white rounded px-4 py-1" onClick={confirmPhoto} disabled={loading}>
                    確認送出
                  </button>
                  <button className="bg-gray-400 text-black rounded px-4 py-1" onClick={cancelPhoto} disabled={loading}>
                    重拍
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
