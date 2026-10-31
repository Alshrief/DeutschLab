import { useState, useEffect } from 'react';
import {
  ScanLine,
  Smartphone,
  Upload,
  Check,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { io } from 'socket.io-client';

export function ScannerView() {
  const [pairingToken, setPairingToken] = useState<string | null>(null);
  const [pairingStatus, setPairingStatus] = useState<'IDLE' | 'PENDING' | 'PAIRED'>('IDLE');
  const [stagingItems, setStagingItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [titleInput, setTitleInput] = useState('Textbook Chapter 1');

  useEffect(() => {
    fetchStaging();
  }, []);

  const fetchStaging = async () => {
    try {
      const res = await fetch('/api/scanner/staging');
      const data = await res.json();
      setStagingItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInitPairing = async () => {
    try {
      const res = await fetch('/api/scanner/pair/init', { method: 'POST' });
      const data = await res.json();
      setPairingToken(data.token);
      setPairingStatus('PENDING');

      // Listen via Socket.io
      const socket = io();
      socket.emit('join_pairing_session', data.token);

      socket.on('mobile_paired', () => {
        setPairingStatus('PAIRED');
      });

      socket.on('scan_uploaded', () => {
        fetchStaging();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', titleInput);
    if (pairingToken) formData.append('pairingToken', pairingToken);

    try {
      const res = await fetch('/api/scanner/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchStaging();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/scanner/staging/${id}/approve`, { method: 'POST' });
      if (res.ok) fetchStaging();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/scanner/staging/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStaging();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-4 space-y-8">
      {/* Phone as Scanner & Upload Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Pairing Box */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase mb-2">
              <Smartphone className="w-4 h-4" /> Phone-as-a-Scanner • ربط كاميرا الهاتف
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              استخدم كاميرا هاتفك لمسح صفحات كتب اللغة الألمانية فورياً
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              يتم إنشاء توكن لمرة واحدة (OTT) مع اقتران عبر WebSockets لتصوير الصفحات وإرسالها فوراً لشاشة الكمبيوتر.
            </p>
          </div>

          {pairingStatus === 'IDLE' ? (
            <button
              onClick={handleInitPairing}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <ScanLine className="w-4 h-4" /> توليد رمز اقتران الهاتف (QR OTT)
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              {/* Visual QR Code SVG Representation */}
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950" fill="currentColor">
                  {/* Position detection markers */}
                  <rect x="5" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="6"/>
                  <rect x="13" y="13" width="12" height="12" fill="black"/>
                  <rect x="67" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="6"/>
                  <rect x="75" y="13" width="12" height="12" fill="black"/>
                  <rect x="5" y="67" width="28" height="28" fill="none" stroke="black" strokeWidth="6"/>
                  <rect x="13" y="75" width="12" height="12" fill="black"/>
                  {/* Data matrix dots */}
                  <rect x="40" y="10" width="8" height="8"/>
                  <rect x="52" y="15" width="8" height="8"/>
                  <rect x="40" y="25" width="8" height="8"/>
                  <rect x="10" y="40" width="8" height="8"/>
                  <rect x="25" y="45" width="8" height="8"/>
                  <rect x="40" y="45" width="16" height="16"/>
                  <rect x="65" y="40" width="8" height="8"/>
                  <rect x="80" y="45" width="8" height="8"/>
                  <rect x="40" y="65" width="8" height="8"/>
                  <rect x="55" y="75" width="8" height="8"/>
                  <rect x="70" y="70" width="12" height="12"/>
                  <rect x="85" y="85" width="8" height="8"/>
                </svg>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">رمز الاقتران لمرة واحدة (OTT):</div>
                <div className="text-2xl font-extrabold tracking-widest text-indigo-400 font-mono">
                  {pairingToken}
                </div>
              </div>

              {/* Mobile Scanner URL and Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {window.location.origin}/?mode=scanner&token={pairingToken}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/?mode=scanner&token=${pairingToken}`;
                      navigator.clipboard.writeText(url);
                      alert('تم نسخ رابط ماسح كاميرا الموبايل إلى الحافظة!');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    📋 نسخ الرابط
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `${window.location.origin}/?mode=scanner&token=${pairingToken}`;
                    }}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-500/20"
                  >
                    📱 تشغيل وضع الكاميرا
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs pt-1">
                {pairingStatus === 'PAIRED' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> الهاتف متصل وجاهز للمسح
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> في انتظار مسح الكود من الهاتف...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Direct PC File Upload Box */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-2">
              <Upload className="w-4 h-4" /> فاحص الملفات المباشر (PDF / Image)
            </div>
            <h3 className="text-lg font-bold text-white mb-1">رفع كتاب أو صورة من الكمبيوتر</h3>
            <p className="text-xs text-slate-400 mb-4">
              فحص الـ Magic Bytes، تجريد بيانات الـ EXIF الأمنية، وإعادة التشفير إلى WebP نقي.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="عنوان المصدر أو اسم الكتاب..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <label className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-300 font-medium transition">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {uploading ? 'جاري الفحص والمعالجة النظيفة...' : 'اختر صورة كتاب أو ملف PDF'}
            </label>
          </div>
        </div>
      </div>

      {/* Staging Preview Workflow */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">منطقة المراجعة والاعتماد (Staging Area)</h3>
            <p className="text-xs text-slate-400">
              راجع المفردات والقواعد المستخرجة من المسح قبل اعتمادها النهائي في قاعدة البيانات.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
            المعلق: {stagingItems.filter((i) => i.status === 'PENDING').length}
          </span>
        </div>

        {stagingItems.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            منطقة المراجعة فارغة حالياً. قم بمسح صفحة لبدء استخراج المحتوى.
          </div>
        ) : (
          <div className="space-y-3">
            {stagingItems.map((item) => {
              let data: any = {};
              try {
                data = JSON.parse(item.extractedData);
              } catch {
                data = {};
              }

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.itemType === 'VOCAB'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {item.itemType}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {data.word || data.title || 'مستخرج جديد'}
                      </div>
                      <div className="text-xs text-emerald-400 font-arabic">
                        {data.arabicTranslation || data.formulaSyntax || ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'APPROVED' ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> تم الاعتماد
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> اعتماد في المعجم
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
