import { useState, useRef, useEffect } from 'react';
import NotionNLogo from '../NotionNLogo';

function flattenObject(obj: any, prefix = ''): string[] {
  const lines: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      lines.push(...flattenObject(value, path));
    } else {
      lines.push(`${path} ${value}`);
    }
  }
  return lines;
}

export default function ChatPage() {
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setMessages((prev) => [...prev, { sender: 'bot', text: '已收到你的查詢，正在生成答案...(一般文本回覆時間為15-20s)' }]);
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
      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
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
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const imageData = canvasRef.current.toDataURL('image/png');
    setPhotoPreview(imageData);
  };

  const confirmPhoto = async () => {
    if (!photoPreview) return;
    setMessages((prev) => [...prev, { sender: 'user', text: '已上傳相片，等待回應...(一般圖片回覆時間為20-30s)', image: photoPreview }]);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setMessages((prev) => [...prev, { sender: 'user', text: '已上傳相片，等待回應...', image: base64 }]);
      setLoading(true);
      const payload = new FormData();
      payload.append('image', base64);
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
      } catch {
        setMessages((prev) => [...prev, { sender: 'bot', text: '圖片上傳時發生錯誤' }]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 font-sans text-gray-800 pb-20">
      <header className="flex items-center gap-2 mb-2">
        <NotionNLogo />
        <span className="font-bold text-xl tracking-wide">Nurse AI</span>
      </header>
      <div className="bg-white border border-gray-300 text-sm text-gray-700 px-4 py-3 rounded-lg shadow-sm mb-4">
        <p>📱 想更方便使用嗎？你可以將本網站加到主畫面，就像 App 一樣使用！</p>
        <p className="mt-1"><strong>iPhone（Safari）：</strong> 點擊下方「分享」圖示 → 選擇「加入主畫面」</p>
        <p className="mt-1"><strong>Android（Chrome）：</strong> 點右上「⋮」 → 選擇「加到主畫面」</p>
      </div>
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
      <div className="space-y-2 w-full max-h-[400px] overflow-y-auto p-2 border rounded-xl bg-neutral-100" style={{ height: Math.min(150 + messages.length * 30, 400) }}>
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-2">
            <img src={msg.sender === 'user' ? '/user.png' : '/nurse.png'} alt={msg.sender === 'user' ? 'User' : 'Nurse'} className="w-8 h-8 rounded-full" />
            <div className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white' : 'bg-gray-200'}`}>
              {msg.image && <img src={msg.image} alt="上傳圖片" className="mb-2 rounded border" width={240} />}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input className="flex-1 border rounded px-2 py-1 text-sm bg-white" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="輸入訊息..." />
        <button className="border border-black text-black bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={sendMessage} disabled={loading}>{loading ? '傳送中…' : '發送'}</button>
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
                  <button onClick={toggleCamera} className="border border-gray-400 px-3 py-1 rounded text-sm hover:bg-gray-100">切換鏡頭</button>
                  <button onClick={closeCamera} className="border border-gray-400 px-3 py-1 rounded text-sm hover:bg-gray-100">關閉鏡頭</button>
                </div>
                <button className="border border-black bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-100" onClick={takePhoto} disabled={loading}>拍照</button>
              </>
            )}
            {photoPreview && (
              <div className="space-y-2">
                <img src={photoPreview} alt="preview" className="border rounded" width={320} height={240} />
                <div className="flex gap-2">
                  <button className="border border-black text-black bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={confirmPhoto} disabled={loading}>確認送出</button>
                  <button className="border border-gray-500 text-gray-700 bg-white px-4 py-1 rounded text-sm hover:bg-gray-100" onClick={cancelPhoto} disabled={loading}>重拍</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pt-4 text-center">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfxQtMDm7-ItDQYkjKlZ5AM7d19lbah2x8-KULy2a1mk4f5uw/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="inline-block border border-black text-black bg-white px-4 py-2 rounded text-sm hover:bg-gray-100 text-center w-full">按此進行小測驗</a>
      </div>
      <div className="text-xs text-gray-500 mt-2">Created by 4人小隊</div>
    </div>
  );
} 