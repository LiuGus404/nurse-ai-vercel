// OpenRouter API Key 常數
const OPENROUTER_API_KEY = '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'
'use client'

console.log("AccessibleTextCommunicator component loaded");

import { useState, useEffect } from 'react'

const commonPhrases = [
  '你好，我是照顧你的人。',
  '現在會幫你換衣服，好嗎？',
  '請問你會痛嗎？',
  '想要喝水嗎？',
  '可以點頭或搖頭。'
]

export default function AccessibleTextCommunicator() {
  const [customInput, setCustomInput] = useState('')
  const [displayQueue, setDisplayQueue] = useState<string[]>([])
  const [currentText, setCurrentText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCharIndex, setSelectedCharIndex] = useState(0)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])

  const handleAdd = (text: string) => {
    setCurrentText(text);
    setDisplayQueue([]);
    setSuggestedQuestions([]);
  }

  const handleShowNext = async () => {
    if (displayQueue.length === 0 || isAnimating) return
    const [next, ...rest] = displayQueue
    setCurrentText(next)
    setDisplayQueue(rest)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1800)
    const suggestions = await generateSuggestions(next)
    setSuggestedQuestions(suggestions)
  }

  // 假 AI 產生建議問題
  const generateSuggestions = (input: string) => {
    // 模擬 AI 推論，可換成 API 呼叫
    const examples: Record<string, string[]> = {
      '請問你會痛嗎？': ['你是哪裡痛？', '痛有多嚴重？', '要幫你按一按嗎？'],
      '想要喝水嗎？': ['要喝暖的還是涼的？', '要用吸管嗎？'],
      '可以點頭或搖頭。': ['你想現在做嗎？', '我數三下你點一下，好嗎？']
    }
    const result = examples[input] || ['你需要什麼？', '還想做什麼？', '我可以再幫你什麼？']
    setSuggestedQuestions(result)
  }

  const chars = currentText.split('')

  const openModalAtIndex = (index: number) => {
    setSelectedCharIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const showPrevChar = () => {
    setSelectedCharIndex((prev) => (prev === 0 ? chars.length - 1 : prev - 1))
  }

  const showNextChar = () => {
    setSelectedCharIndex((prev) => (prev === chars.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowLeft') {
        showPrevChar()
      } else if (e.key === 'ArrowRight') {
        showNextChar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, chars.length])

  return (
    <main className="min-h-screen bg-[#F7F6F3] p-4">
      <div className="bg-white border border-[#DADADA] rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <img src="/card.png" alt="溝通放大卡圖示" className="w-6 h-6" />
          <h3 className="text-lg font-semibold text-[#333]">溝通放大卡</h3>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {commonPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleAdd(phrase)}
              className="bg-[#F2F2F2] hover:bg-[#e1e1e1] text-[#333] rounded-2xl border border-transparent px-5 py-2 text-sm transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          <textarea
            placeholder="輸入自訂訊息（例如：請轉身）"
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-white shadow-sm text-[#333] focus:outline-none focus:ring-2 focus:ring-[#a8a8a8]"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (customInput.trim()) {
                handleAdd(customInput.trim())
                setCustomInput('')
              }
            }}
            className="bg-[#F2F2F2] hover:bg-[#e1e1e1] text-[#333] rounded-2xl border border-transparent px-6 py-2 transition-colors"
          >
            加入
          </button>
        </div>

        <div className="bg-white border border-[#DADADA] rounded-2xl p-6 min-h-[80px] flex items-center justify-center text-2xl font-semibold text-[#333] shadow-md cursor-pointer select-none" onClick={() => { if (chars.length > 0) openModalAtIndex(0) }}>
          {chars.length > 0 ? chars.map((char, idx) => (
            <span key={idx} className="inline-block px-1" onClick={(e) => { e.stopPropagation(); openModalAtIndex(idx) }}>
              {char}
            </span>
          )) : '溝通卡載入中...'}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleShowNext}
            className="bg-[#F2F2F2] hover:bg-[#e1e1e1] text-[#333] rounded-2xl px-8 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating || displayQueue.length === 0}
          >
            下一句
          </button>
        </div>

        {suggestedQuestions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">AI 建議你可接著問：</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAdd(q)}
                  className="bg-[#EDEDED] text-sm px-4 py-2 rounded-xl hover:bg-[#dcdcdc]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-white flex flex-col items-center justify-center text-black z-[100] select-none"
          onClick={closeModal}
        >
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 transform text-3xl font-bold px-4 py-2 bg-white border border-gray-400 rounded"
            onClick={(e) => { e.stopPropagation(); showPrevChar() }}
            aria-label="上一字"
          >
            ‹
          </button>
          <div className="text-[40vw] font-bold leading-[1]">
            {chars[selectedCharIndex]}
          </div>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 transform text-3xl font-bold px-4 py-2 bg-white border border-gray-400 rounded"
            onClick={(e) => { e.stopPropagation(); showNextChar() }}
            aria-label="下一字"
          >
            ›
          </button>
        </div>
      )}
    </main>
  )
}
// 產生建議訊息的函式
async function generateSuggestions(input: string): Promise<string[]> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout:free',
      messages: [
        {
          role: 'user',
          content: input,
        }
      ]
    })
  });
  const data = await response.json();
  // 輸出格式依照 API 回應格式調整，這裡假設 choices[0].message.content
  return data.choices?.[0]?.message?.content ? [data.choices[0].message.content] : [];
}