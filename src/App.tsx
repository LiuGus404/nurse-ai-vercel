// ... 省略前面內容（保持不變） ...

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
  className="inline-block border border-black text-black bg-white px-4 py-2 rounded text-sm hover:bg-gray-100"
>
  按此進行小測驗
</a>
</div>
</div>
);
}

export default App;
