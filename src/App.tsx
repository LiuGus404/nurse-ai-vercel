// 已整合切換與關閉鏡頭功能（完整合併版）
import { useState, useRef, useEffect } from 'react';
import NotionNLogo from './NotionNLogo';
import ChatPage from './pages/ChatPage';
import TutorialVideos from './pages/TutorialVideos';
import UsageGuide from './pages/UsageGuide';
import QuizPage from './pages/QuizPage';

function flattenObject(obj: any, prefix = ''): string[] {
  const lines: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      lines.push(...flattenObject(value, path));
    } else {
      lines.push(`${path} ${value}`);  // 改掉冒號為空格
    }
  }
  return lines;
}

function App() {
  const [activeTab, setActiveTab] = useState('chat');
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
  
    // 這一行是新加的提示語
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
  
      // 把原本的暫時訊息更新成最終回應（或直接 append）
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
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="flex items-center gap-2 px-4 py-3 border-b bg-white shadow-sm">
        <NotionNLogo />
        <span className="font-bold text-xl tracking-wide">Nurse AI</span>
      </header>
      <main className="flex-1 p-4">
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'video' && <TutorialVideos />}
        {activeTab === 'guide' && <UsageGuide />}
        {activeTab === 'quiz' && <QuizPage />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 shadow-lg z-10">
        <button className={`flex flex-col items-center text-xs ${activeTab==='chat'?'text-black font-bold':'text-gray-500'}`} onClick={()=>setActiveTab('chat')}>
          <span className="text-lg">💬</span>
          對話框
        </button>
        <button className={`flex flex-col items-center text-xs ${activeTab==='video'?'text-black font-bold':'text-gray-500'}`} onClick={()=>setActiveTab('video')}>
          <span className="text-lg">🎬</span>
          教學影片
        </button>
        <button className={`flex flex-col items-center text-xs ${activeTab==='guide'?'text-black font-bold':'text-gray-500'}`} onClick={()=>setActiveTab('guide')}>
          <span className="text-lg">📖</span>
          使用方法
        </button>
        <button className={`flex flex-col items-center text-xs ${activeTab==='quiz'?'text-black font-bold':'text-gray-500'}`} onClick={()=>setActiveTab('quiz')}>
          <span className="text-lg">📝</span>
          小測驗
        </button>
      </nav>
    </div>
  );
}

export default App;