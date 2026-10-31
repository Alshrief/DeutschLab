import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, RefreshCw, Send, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';

interface MobileScannerViewProps {
  token?: string;
  onBack?: () => void;
}

export function MobileScannerView({ token: initialToken, onBack }: MobileScannerViewProps) {
  const [token, setToken] = useState(initialToken || '');
  const [paired, setPaired] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check URL search params for token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken && !token) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Connect to WebSocket room for this pairing token
      const socket = io();
      socket.emit('join_pairing_session', token);

      // Verify token with backend
      fetch('/api/scanner/pair/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => {
          if (res.ok) setPaired(true);
        })
        .catch(console.error);

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  // Start mobile camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setCameraError('تعذر الوصول للكاميرا مباشرة. تأكد من إعطاء إذن الكاميرا أو استخدم رفع ملف من ألبوم الصور.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    }
  };

  const uploadPhoto = async () => {
    if (!capturedImage) return;
    setUploading(true);
    setUploadSuccess(false);

    try {
      // Convert dataUrl to Blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob, 'mobile_scan.jpg');
      formData.append('pairingToken', token);
      formData.append('title', 'لقطة من كاميرا الهاتف');

      const uploadRes = await fetch('/api/scanner/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.ok) {
        setUploadSuccess(true);
        setCapturedImage(null);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-400" /> ماسح الهاتف (Phone Scanner)
            </h2>
            <div className="text-[11px] text-slate-400 font-mono">
              توكن الاقتران: <span className="text-indigo-400 font-bold">{token || 'غير محدد'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {paired ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> متصل بالكمبيوتر
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> جاري الربط...
            </span>
          )}
        </div>
      </div>

      {uploadSuccess && (
        <div className="my-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> تم إرسال الصفحة لشاشة الكمبيوتر بنجاح!
        </div>
      )}

      {/* Camera Preview Area */}
      <div className="my-4 flex-1 flex flex-col justify-center items-center relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[360px]">
        {cameraError ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-3">
            <p className="text-rose-400">{cameraError}</p>
            <label className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold inline-block cursor-pointer">
              اختر صورة كتاب من هاتفك
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setCapturedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        ) : capturedImage ? (
          <div className="w-full h-full relative">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            <div className="absolute bottom-4 inset-x-4 flex gap-3">
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white text-xs font-semibold"
              >
                إعادة التقاط
              </button>
              <button
                onClick={uploadPhoto}
                disabled={uploading}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/30"
              >
                {uploading ? 'جاري الإرسال للكمبيوتر...' : <><Send className="w-4 h-4" /> إرسال للكمبيوتر</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Alignment Overlay */}
            <div className="absolute inset-8 border-2 border-dashed border-indigo-400/50 rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-white/70 bg-black/50 px-2 py-1 rounded">
                وجّه الكاميرا نحو صفحة الكتاب
              </span>
            </div>

            {/* Shutter Button */}
            <button
              onClick={takePhoto}
              className="absolute bottom-6 w-16 h-16 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white shadow-2xl active:scale-95 transition"
            >
              <Camera className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-500">
        يتم بث الصور مباشرة عبر WebSockets إلى منطقة المراجعة Staging على شاشة الكمبيوتر.
      </div>
    </div>
  );
}
