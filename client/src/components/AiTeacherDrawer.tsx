import { useState } from 'react';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';

interface AiTeacherDrawerProps {
  cefrLevel: string;
}

export function AiTeacherDrawer({ cefrLevel }: AiTeacherDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hallo! أنا معلمك الآلي المخصص للمستوى (${cefrLevel}). يمكنك سؤالي عن أي قاعدة، أو طلب صياغة جمل، أو الاستفسار عن حالات الإعراب (Akkusativ / Dativ). كيف أساعدك اليوم؟`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setSending(true);

    try {
      const response = await fetch('/api/grammar/xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentenceDe: userMsg,
          learnerLevel: cefrLevel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.isCorrect
          ? `ممتاز! هذه الجملة سليمة 100% نحوياً: "${data.correctedSentence || userMsg}". ${data.teacherFeedbackAr || ''}`
          : `انتبه: الصياغة الأصح هي: "${data.correctedSentence}".\nالسبب: ${data.mistakes?.[0]?.surgicalExplanationAr || ''}`;

        setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `في المستوى ${cefrLevel}، القاعدة الأساسية تنص على وضع الفعل المصرف دائماً في الموقع الثاني بالجمَل الرئيسية، ومراعاة أدوات المعرفة (der/die/das).`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `ممتاز! واصل التدريب اليومي، وحافظ على مراجعة بطاقات الـ FSRS لتثبيت المفردات بالذاكرة طويلة المدى.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-105 transition flex items-center gap-2 font-bold text-xs"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span className="hidden sm:inline">المعلم الآلي الشخصي</span>
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">المعلم الآلي الذكي (AI Teacher)</h4>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> واعي بالمستوى {cefrLevel}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-arabic'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex-shrink-0 flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-arabic">
                <Bot className="w-3.5 h-3.5 animate-spin" /> المعلم يفكر في السؤال...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              placeholder="اسأل المعلم عن أي شيء..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
