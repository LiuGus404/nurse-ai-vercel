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
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; image?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<'wear' | 'care' | null>(null);
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

    const thinkingMessage = { sender: 'bot', text: '正在思考中...', image: undefined };
    setMessages((prev) => [...prev, thinkingMessage]);

    const startTime = performance.now();
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

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: `${replyText}\n\n🕒 回應時間：${duration} 秒` },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev.slice(0, -1), { sender: 'bot', text: '發生錯誤，請稍後再試。' }]);
    } finally {
      setLoading(false);
    }
  };
