import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Database,
  Lock,
  Download,
  CheckCircle2,
} from 'lucide-react';

export function SecurityDashboardView() {
  const [backups, setBackups] = useState<any[]>([]);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleRestore = async (backupId: string) => {
    if (!confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال قاعدة البيانات الحالية بها.')) return;
    setRestoringId(backupId);
    setRestoreMessage(null);
    try {
      const res = await fetch('/api/security/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      });
      if (res.ok) {
        setRestoreMessage('تمت استعادة قاعدة البيانات بنجاح!');
        fetchSecurityData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRestoringId(null);
    }
  };

  const fetchSecurityData = async () => {
    try {
      const bRes = await fetch('/api/security/backups');
      const bData = await bRes.json();
      setBackups(bData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    setBackupSuccess(false);
    try {
      const res = await fetch('/api/security/backup', { method: 'POST' });
      if (res.ok) {
        setBackupSuccess(true);
        fetchSecurityData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingBackup(false);
    }
  };

  return (
    <div className="py-4 space-y-6">
      {/* Security Engine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AES Vault Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">خزنة التشفير AES-256-GCM</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            تشفير مفاتيح الـ API مع مصادقة Tag و IV عشوائي 96-bit ومفتاح رئيسي خارج قاعدة البيانات.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> الخزنة نشطة ومؤمنة
          </div>
        </div>

        {/* SSRF Guard Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">حارس الـ SSRF Guard</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            حظر كامل لنطاقات الـ Private IP و Cloud Metadata (169.254.169.254) وفحص الـ DNS Rebinding.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> فحص الـ DNS مفعل
          </div>
        </div>

        {/* Database Engine Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">سلامة قاعدة البيانات SQLite</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            تخزين محلي صارم مع تجريد وسائط EXIF والتحقق من Magic Bytes لكل ملف مرفوع.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-blue-400 flex items-center gap-1.5">
            Prisma Strict Schema
          </div>
        </div>
      </div>

      {/* One-Click Backup Manager */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> إدارة النسخ الاحتياطية الفورية (One-Click Backup)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تصدير لقطة متكاملة لقاعدة بيانات SQLite مع توليد تجزئة SHA-256 للتحقق من سلامة البيانات.
            </p>
          </div>

          <button
            onClick={handleCreateBackup}
            disabled={creatingBackup}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {creatingBackup ? 'جاري النسخ الاحتياطي...' : 'إنشاء نسخة احتياطية فورية الآن'}
          </button>
        </div>

        {backupSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> تم إنشاء النسخة الاحتياطية بنجاح وحساب الـ SHA-256 Checksum!
          </div>
        )}

        {restoreMessage && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {restoreMessage}
          </div>
        )}

        {/* Backups List */}
        {backups.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            لا توجد نسخ احتياطية مسجلة بعد. اضغط على الزر بالأعلى لإنشاء أول نسخة.
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{b.filename}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-lg">
                    SHA-256: {b.checksumSha256}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>{(b.sizeBytes / 1024).toFixed(1)} KB</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                    {b.status}
                  </span>
                  <button
                    onClick={() => handleRestore(b.id)}
                    disabled={restoringId === b.id}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition font-sans disabled:opacity-50"
                  >
                    {restoringId === b.id ? 'جاري الاستعادة...' : 'استعادة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
