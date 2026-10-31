import { useState, useEffect } from 'react';
import {
  Cpu,
  RotateCcw,
  Activity,
  Plus,
} from 'lucide-react';

export function AiProvidersView() {
  const [providers, setProviders] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, any>>({});

  // Add provider modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderType, setNewProviderType] = useState('CUSTOM');
  const [newModelName, setNewModelName] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newCustomEndpoint, setNewCustomEndpoint] = useState('');
  const [newCustomHeaders, setNewCustomHeaders] = useState('');
  const [showAdvancedAdd, setShowAdvancedAdd] = useState(false);
  const [detectedHint, setDetectedHint] = useState<string | null>(null);
  const [curlSnippet, setCurlSnippet] = useState('');
  const [curlParsedHints, setCurlParsedHints] = useState<string[]>([]);
  const [showCurlSection, setShowCurlSection] = useState(false);
  const [creatingProvider, setCreatingProvider] = useState(false);

  // Edit provider modal state
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [editProviderType, setEditProviderType] = useState('CUSTOM');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [baseUrlInput, setBaseUrlInput] = useState('');
  const [customEndpointInput, setCustomEndpointInput] = useState('');
  const [customHeadersInput, setCustomHeadersInput] = useState('');
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [editDetectedHint, setEditDetectedHint] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const analyzeUrl = (rawInput: string) => {
    if (!rawInput || !rawInput.trim()) return null;

    let input = rawInput.trim();
    // 1. If user pasted curl command or markdown, extract the actual URL
    const urlMatch = input.match(/https?:\/\/[^\s"'\\]+/i);
    let url = urlMatch ? urlMatch[0] : input;

    // Clean quotes, backslashes, or trailing slashes
    url = url.replace(/["'\\]/g, '').trim();

    const lower = url.toLowerCase();
    let protocol = 'CUSTOM';
    let endpoint = '/chat/completions';
    let baseUrl = url;
    let hint: string | null = null;

    // Anthropic Detection
    if (lower.includes('anthropic.com') || lower.includes('/messages') || lower.includes('claude')) {
      protocol = 'ANTHROPIC';
      endpoint = '/messages';
      baseUrl = url.replace(/\/messages\/?$/i, '').replace(/\/+$/, '');
      hint = '🧠 تم الكشف تلقائياً: بروتوكول Anthropic Messages API (Claude Spec)';
    }
    // OpenAI Responses API Detection
    else if (lower.includes('/responses')) {
      protocol = 'OPENAI';
      endpoint = '/responses';
      baseUrl = url.replace(/\/responses\/?$/i, '').replace(/\/+$/, '');
      hint = '⚡ تم الكشف تلقائياً: بروتوكول OpenAI Responses API (input & instructions)';
    }
    // OpenAI Official
    else if (lower.includes('openai.com')) {
      protocol = 'OPENAI';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: بروتوكول OpenAI Chat Completions الرسمي';
    }
    // Google Gemini
    else if (lower.includes('generativelanguage.googleapis.com') || lower.includes('gemini') || lower.includes('googleapis.com')) {
      protocol = 'GEMINI';
      baseUrl = 'https://generativelanguage.googleapis.com';
      hint = '🔷 تم الكشف تلقائياً: بروتوكول Google Gemini الرسمي';
    }
    // Ollama
    else if (lower.includes('localhost:11434') || lower.includes('127.0.0.1:11434') || lower.includes('ollama')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🦙 تم الكشف تلقائياً: خادم Ollama المحلي (بدون مفتاح API)';
    }
    // OpenRouter
    else if (lower.includes('openrouter.ai')) {
      protocol = 'OPENROUTER';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🌐 تم الكشف تلقائياً: بوابة OpenRouter الموحدة';
    }
    // Groq
    else if (lower.includes('groq.com')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '⚡ تم الكشف تلقائياً: مزود Groq فائق السرعة (OpenAI-Compatible)';
    }
    // DeepSeek
    else if (lower.includes('deepseek.com')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🐋 تم الكشف تلقائياً: مزود DeepSeek (OpenAI-Compatible)';
    }
    // Mistral
    else if (lower.includes('mistral.ai')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🌪️ تم الكشف تلقائياً: مزود Mistral AI (OpenAI-Compatible)';
    }
    // Together AI
    else if (lower.includes('together.xyz') || lower.includes('together.ai')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: مزود Together AI (OpenAI-Compatible)';
    }
    // Cohere
    else if (lower.includes('cohere.com') || lower.includes('cohere.ai')) {
      protocol = 'CUSTOM';
      endpoint = '/chat';
      baseUrl = url.replace(/\/chat\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: مزود Cohere API';
    }
    // Cerebras
    else if (lower.includes('cerebras.ai')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: مزود Cerebras (OpenAI-Compatible)';
    }
    // Perplexity
    else if (lower.includes('perplexity.ai')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: مزود Perplexity AI (OpenAI-Compatible)';
    }
    // Generic Chat Completions in path
    else if (lower.includes('/chat/completions') || lower.includes('/completions')) {
      protocol = 'CUSTOM';
      endpoint = '/chat/completions';
      baseUrl = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/completions\/?$/i, '').replace(/\/+$/, '');
      hint = '🟢 تم الكشف تلقائياً: بروتوكول OpenAI Chat Completions القياسي';
    }

    return { baseUrl, endpoint, protocol, hint };
  };

  const handleBaseUrlChange = (inputUrl: string) => {
    const analysis = analyzeUrl(inputUrl);
    if (analysis && analysis.hint) {
      setNewBaseUrl(analysis.baseUrl);
      setNewProviderType(analysis.protocol);
      setNewCustomEndpoint(analysis.endpoint);
      setDetectedHint(analysis.hint);
    } else {
      setNewBaseUrl(inputUrl);
      setDetectedHint(null);
    }
  };

  const handleEditBaseUrlChange = (inputUrl: string) => {
    const analysis = analyzeUrl(inputUrl);
    if (analysis && analysis.hint) {
      setBaseUrlInput(analysis.baseUrl);
      setEditProviderType(analysis.protocol);
      setCustomEndpointInput(analysis.endpoint);
      setEditDetectedHint(analysis.hint);
    } else {
      setBaseUrlInput(inputUrl);
      setEditDetectedHint(null);
    }
  };

  const parseCurlCommand = (curlText: string) => {
    if (!curlText || !curlText.trim()) return null;

    const result = {
      baseUrl: '',
      endpoint: '/chat/completions',
      apiKey: '',
      modelName: '',
      providerType: 'CUSTOM' as 'CUSTOM' | 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'OPENROUTER',
      customHeaders: {} as Record<string, string>,
      hints: [] as string[],
    };

    // 1. Extract URL
    const urlMatch = curlText.match(/https?:\/\/[^\s"'\\]+/i);
    if (!urlMatch) return null;

    let fullUrl = urlMatch[0].replace(/["'\\]/g, '').trim();

    // 2. Separate Base URL & Endpoint
    if (fullUrl.includes('/v1/messages') || fullUrl.endsWith('/messages')) {
      result.endpoint = '/messages';
      result.baseUrl = fullUrl.replace(/\/messages\/?$/i, '').replace(/\/+$/, '');
      result.providerType = 'ANTHROPIC';
      result.hints.push('🧠 تم تحديد بروتوكول Anthropic Messages من مسار /messages');
    } else if (fullUrl.includes('/responses')) {
      result.endpoint = '/responses';
      result.baseUrl = fullUrl.replace(/\/responses\/?$/i, '').replace(/\/+$/, '');
      result.providerType = 'OPENAI';
      result.hints.push('⚡ تم تحديد بروتوكول OpenAI Responses من مسار /responses');
    } else if (fullUrl.includes('/chat/completions')) {
      result.endpoint = '/chat/completions';
      result.baseUrl = fullUrl.replace(/\/chat\/completions\/?$/i, '').replace(/\/+$/, '');
      result.providerType = 'CUSTOM';
      result.hints.push('🟢 تم تحديد بروتوكول Chat Completions من مسار /chat/completions');
    } else if (fullUrl.includes('/chat')) {
      result.endpoint = '/chat';
      result.baseUrl = fullUrl.replace(/\/chat\/?$/i, '').replace(/\/+$/, '');
      result.providerType = 'CUSTOM';
      result.hints.push('🟢 تم تحديد مسار /chat مخصص');
    } else {
      result.baseUrl = fullUrl.replace(/\/+$/, '');
      result.endpoint = '/chat/completions';
    }

    // 3. Extract Headers (-H "Key: Value" or --header 'Key: Value')
    const headerRegex = /(?:-H|--header)\s+["']?([^"'\n\r\\]+)["']?/gi;
    let match;
    while ((match = headerRegex.exec(curlText)) !== null) {
      const headerLine = match[1].trim();
      const colonIdx = headerLine.indexOf(':');
      if (colonIdx > 0) {
        const key = headerLine.substring(0, colonIdx).trim();
        const val = headerLine.substring(colonIdx + 1).trim();

        if (key.toLowerCase() === 'authorization') {
          const bearerMatch = val.match(/Bearer\s+([^\s]+)/i);
          if (bearerMatch) {
            result.apiKey = bearerMatch[1].replace(/["']/g, '');
            result.hints.push('🔑 تم استخراج مفتاح الـ API من ترويسة Authorization');
          } else {
            result.apiKey = val;
          }
        } else if (key.toLowerCase() === 'x-api-key') {
          result.apiKey = val.replace(/["']/g, '');
          result.providerType = 'ANTHROPIC';
          result.hints.push('🔑 تم استخراج مفتاح الـ API من ترويسة x-api-key (خاص بأنثروبك)');
        } else if (key.toLowerCase() !== 'content-type') {
          result.customHeaders[key] = val;
        }
      }
    }

    // 4. Extract Body (-d '...' or --data '...')
    const bodyMatch =
      curlText.match(/(?:-d|--data|--data-raw)\s+['"]?(\{[\s\S]*?\})['"]?(?:\s|$|\\)/i) ||
      curlText.match(/(\{[\s\S]*?"model"[\s\S]*?\})/i);

    if (bodyMatch) {
      try {
        let jsonStr = bodyMatch[1].trim().replace(/\\n/g, '').replace(/\\"/g, '"');
        const parsedBody = JSON.parse(jsonStr);

        if (parsedBody.model) {
          result.modelName = parsedBody.model;
          result.hints.push(`🏷️ تم استخراج اسم النموذج: ${parsedBody.model}`);
        }

        if (parsedBody.instructions && parsedBody.input) {
          result.providerType = 'OPENAI';
          result.endpoint = '/responses';
          result.hints.push('⚡ تم تأكيد بروتوكول Responses API من هيكل البيانات (input/instructions)');
        } else if (parsedBody.messages) {
          if (result.providerType !== 'ANTHROPIC') {
            result.providerType = 'CUSTOM';
          }
        }
      } catch {
        const modelRegex = /"model"\s*:\s*"([^"]+)"/i;
        const mMatch = curlText.match(modelRegex);
        if (mMatch) {
          result.modelName = mMatch[1];
          result.hints.push(`🏷️ تم استخراج اسم النموذج: ${mMatch[1]}`);
        }
      }
    } else {
      const modelRegex = /"model"\s*:\s*"([^"]+)"/i;
      const mMatch = curlText.match(modelRegex);
      if (mMatch) {
        result.modelName = mMatch[1];
        result.hints.push(`🏷️ تم استخراج اسم النموذج: ${mMatch[1]}`);
      }
    }

    return result;
  };

  const handleImportCurl = (snippetToParse?: string) => {
    const raw = snippetToParse || curlSnippet;
    if (!raw.trim()) return;

    const parsed = parseCurlCommand(raw);
    if (!parsed) return;

    if (parsed.baseUrl) setNewBaseUrl(parsed.baseUrl);
    if (parsed.endpoint) setNewCustomEndpoint(parsed.endpoint);
    if (parsed.apiKey) setNewApiKey(parsed.apiKey);
    if (parsed.modelName) setNewModelName(parsed.modelName);
    if (parsed.providerType) setNewProviderType(parsed.providerType);
    if (Object.keys(parsed.customHeaders).length > 0) {
      setNewCustomHeaders(JSON.stringify(parsed.customHeaders, null, 2));
    }
    if (!newProviderName) {
      const domain = parsed.baseUrl.replace(/https?:\/\//, '').split('/')[0];
      setNewProviderName(parsed.modelName ? `${parsed.modelName} (${domain})` : `API (${domain})`);
    }

    setCurlParsedHints(parsed.hints);
    setDetectedHint(
      parsed.hints.length > 0
        ? `✨ تم استيراد وتحليل أمر الـ cURL بنجاح! (${parsed.hints.length} عناصر مكتشفة)`
        : '✨ تم استخراج البيانات من أمر cURL بنجاح!'
    );
  };

  const handlePresetSelect = (presetKey: string) => {
    setNewCustomEndpoint('');
    setDetectedHint(null);
    switch (presetKey) {
      case 'OLLAMA':
        setNewProviderName('Ollama (محلي)');
        setNewProviderType('CUSTOM');
        setNewModelName('llama3.2');
        setNewBaseUrl('http://localhost:11434/v1');
        break;
      case 'MISTRAL':
        setNewProviderName('Mistral AI');
        setNewProviderType('CUSTOM');
        setNewModelName('mistral-small-latest');
        setNewBaseUrl('https://api.mistral.ai/v1');
        break;
      case 'ANTHROPIC':
        setNewProviderName('Anthropic Claude (Messages API)');
        setNewProviderType('ANTHROPIC');
        setNewModelName('claude-3-5-sonnet-20241022');
        setNewBaseUrl('https://api.anthropic.com/v1');
        break;
      case 'OPENAI_CHAT':
        setNewProviderName('OpenAI (Chat Completions)');
        setNewProviderType('OPENAI');
        setNewModelName('gpt-4o-mini');
        setNewBaseUrl('https://api.openai.com/v1');
        break;
      case 'OPENAI_RESPONSES':
        setNewProviderName('OpenAI (Responses API)');
        setNewProviderType('OPENAI');
        setNewModelName('gpt-4o-mini');
        setNewBaseUrl('https://api.openai.com/v1');
        setNewCustomEndpoint('/responses');
        break;
      case 'GROQ':
        setNewProviderName('Groq (سريع جداً)');
        setNewProviderType('CUSTOM');
        setNewModelName('llama-3.3-70b-versatile');
        setNewBaseUrl('https://api.groq.com/openai/v1');
        break;
      case 'DEEPSEEK':
        setNewProviderName('DeepSeek');
        setNewProviderType('CUSTOM');
        setNewModelName('deepseek-chat');
        setNewBaseUrl('https://api.deepseek.com/v1');
        break;
      case 'GEMINI':
        setNewProviderName('Google Gemini');
        setNewProviderType('GEMINI');
        setNewModelName('gemini-1.5-flash');
        setNewBaseUrl('https://generativelanguage.googleapis.com');
        break;
      case 'OPENROUTER':
        setNewProviderName('OpenRouter');
        setNewProviderType('OPENROUTER');
        setNewModelName('anthropic/claude-3.5-sonnet');
        setNewBaseUrl('https://openrouter.ai/api/v1');
        break;
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        fetch('/api/providers'),
        fetch('/api/tasks'),
        fetch('/api/tasks/metrics/usage'),
      ]);
      const [pData, tData, mData] = await Promise.all([pRes.json(), tRes.json(), mRes.json()]);
      setProviders(pData);
      setTasks(tData);
      setMetrics(mData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProvider = async () => {
    if (!newProviderName || !newModelName) return;
    setCreatingProvider(true);
    try {
      let parsedHeaders = undefined;
      if (newCustomHeaders.trim()) {
        try {
          parsedHeaders = JSON.parse(newCustomHeaders);
        } catch {
          // ignore parsing error
        }
      }

      await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProviderName,
          providerType: newProviderType,
          modelName: newModelName,
          baseUrl: newBaseUrl || undefined,
          apiKey: newApiKey || undefined,
          customEndpoint: newCustomEndpoint.trim() || undefined,
          customHeaders: parsedHeaders,
        }),
      });
      setShowAddModal(false);
      setNewProviderName('');
      setNewModelName('');
      setNewBaseUrl('');
      setNewApiKey('');
      setNewCustomEndpoint('');
      setNewCustomHeaders('');
      setShowAdvancedAdd(false);
      loadAllData();
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingProvider(false);
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/providers/${id}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult((prev) => ({ ...prev, [id]: data }));
      loadAllData();
    } catch (e) {
      console.error(e);
    } finally {
      setTestingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await fetch(`/api/providers/${id}/set-default`, { method: 'POST' });
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProvider = async () => {
    if (!selectedProvider) return;
    setSaving(true);
    try {
      let parsedHeaders = undefined;
      if (customHeadersInput.trim()) {
        try {
          parsedHeaders = JSON.parse(customHeadersInput);
        } catch {
          // ignore
        }
      }

      const body: any = {
        providerType: editProviderType,
        modelName: modelInput,
        baseUrl: baseUrlInput,
        customEndpoint: customEndpointInput.trim() || null,
        customHeaders: parsedHeaders,
      };
      if (apiKeyInput) body.apiKey = apiKeyInput;

      await fetch(`/api/providers/${selectedProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setSelectedProvider(null);
      setApiKeyInput('');
      setCustomEndpointInput('');
      setCustomHeadersInput('');
      setShowAdvancedEdit(false);
      loadAllData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRetryTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/retry/${id}`, { method: 'POST' });
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/cancel/${id}`, { method: 'POST' });
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-4 space-y-8">
      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">إجمالي الطلبات (Requests)</div>
            <div className="text-xl font-extrabold text-white mt-1">{metrics.totalRequests || 0}</div>
            <div className="text-[10px] text-emerald-400 mt-1">{metrics.successfulRequests} ناجح</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">التوكنز المستهلكة (Tokens)</div>
            <div className="text-xl font-extrabold text-white mt-1">
              {(metrics.totalTokens || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {(metrics.inputTokens || 0).toLocaleString()} In / {(metrics.outputTokens || 0).toLocaleString()} Out
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">التكلفة التقديرية (USD)</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">
              ${(metrics.totalCostUsd || 0).toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">حساب دقيق لأسعار كل موديل</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">متوسط زمن الاستجابة (Latency)</div>
            <div className="text-xl font-extrabold text-blue-400 mt-1 font-mono">
              {metrics.averageLatencyMs || 0}ms
            </div>
            <div className="text-[10px] text-slate-500 mt-1">فحص حقيقي للشبكة</div>
          </div>
        </div>
      )}

      {/* AI Providers CRUD */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" /> إدارة مزودي الذكاء الاصطناعي (Multi-Provider Engine)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تشفير AES-256 للمفاتيح، فحص سرعة الاستجابة (Latency)، واختيار المزود النشط.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> إضافة مزود جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => {
            const isTesting = testingId === p.id;
            const res = testResult[p.id];

            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  p.isDefault
                    ? 'bg-blue-950/20 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    {p.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-semibold">
                        الافتراضي
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>النموذج:</span>
                      <span className="font-mono text-slate-200">{p.modelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المفتاح:</span>
                      <span className="font-mono text-slate-500">
                        {p.hasApiKey ? '••••••••••••' : 'غير مدخل'}
                      </span>
                    </div>
                    {p.latencyMs && (
                      <div className="flex justify-between">
                        <span>زمن الاستجابة:</span>
                        <span className="font-mono text-emerald-400">{p.latencyMs}ms</span>
                      </div>
                    )}
                  </div>

                  {res && (
                    <div
                      className={`mt-3 p-2 rounded-xl text-[11px] font-arabic ${
                        res.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {res.status === 'SUCCESS'
                        ? `الاتصال ناجح (${res.latencyMs}ms)! الرد: ${res.response}`
                        : `فشل الاتصال: ${res.error}`}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTestConnection(p.id)}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isTesting ? 'جاري الفحص...' : 'فحص الاتصال'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedProvider(p);
                        setEditProviderType(p.providerType || 'CUSTOM');
                        setModelInput(p.modelName);
                        setBaseUrlInput(p.baseUrl || '');
                        setCustomEndpointInput(p.customEndpoint || '');
                        setCustomHeadersInput(
                          p.customHeaders
                            ? typeof p.customHeaders === 'string'
                              ? p.customHeaders
                              : JSON.stringify(p.customHeaders, null, 2)
                            : ''
                        );
                        setApiKeyInput('');
                        setEditDetectedHint(null);
                        setShowAdvancedEdit(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition"
                    >
                      تعديل
                    </button>
                    {!p.isDefault && (
                      <button
                        onClick={() => handleSetDefault(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition"
                      >
                        تفعيل
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleUp space-y-4">
            <h3 className="text-base font-bold text-white">إضافة مزود ذكاء اصطناعي جديد</h3>

            {/* Smart cURL Importer Section */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🪄</span>
                  <span className="text-xs font-bold text-indigo-300">
                    مستورد ومحلل أوامر cURL التلقائي (Smart Importer)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurlSection(!showCurlSection)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-200 font-semibold underline"
                >
                  {showCurlSection ? 'إخفاء ▴' : 'فتح المحلل ▾'}
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                الصق أمر الـ curl كاملاً (من OpenAI، Anthropic، أو أي سيرفر مخصص)، وسيقوم النظام بتعبئة الرابط والنموذج والمفتاح والبروتوكول فوراً!
              </p>

              {showCurlSection && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <textarea
                    rows={4}
                    placeholder={`curl https://example.com/v1/chat/completions \\\n  -H "Authorization: Bearer sk-your-key" \\\n  -d '{"model": "claude-sonnet-4-6", "messages": [...]}' `}
                    value={curlSnippet}
                    onChange={(e) => {
                      setCurlSnippet(e.target.value);
                      handleImportCurl(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-indigo-200 focus:outline-none focus:border-indigo-400 font-mono text-left"
                    dir="ltr"
                  />

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleImportCurl()}
                      disabled={!curlSnippet.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-indigo-600/20"
                    >
                      <span>استخراج وتعبئة الحقول الآن ⚡</span>
                    </button>

                    {curlParsedHints.length > 0 && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        ✓ تم استخراج {curlParsedHints.length} إعدادات
                      </span>
                    )}
                  </div>

                  {curlParsedHints.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                      {curlParsedHints.map((hint, hIdx) => (
                        <div key={hIdx} className="text-[11px] text-emerald-300 font-medium">
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-amber-400 font-bold block mb-1">
                ⚡ أو اختر قالباً جاهزاً بضغطة زر (One-Click Presets):
              </label>
              <select
                onChange={(e) => handlePresetSelect(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="" disabled>-- اختر قالباً لملء الإعدادات تلقائياً --</option>
                <option value="OLLAMA">🦙 Ollama محلي (http://localhost:11434/v1)</option>
                <option value="MISTRAL">🌪️ Mistral AI (api.mistral.ai/v1)</option>
                <option value="ANTHROPIC">🧠 Anthropic Claude (Messages API /v1/messages)</option>
                <option value="OPENAI_CHAT">🟢 OpenAI (Chat Completions /v1/chat/completions)</option>
                <option value="OPENAI_RESPONSES">⚡ OpenAI (Responses API /v1/responses)</option>
                <option value="GROQ">⚡ Groq Ultra-Fast (api.groq.com/openai/v1)</option>
                <option value="DEEPSEEK">🐋 DeepSeek (api.deepseek.com/v1)</option>
                <option value="GEMINI">🔷 Google Gemini (generativelanguage.googleapis.com)</option>
                <option value="OPENROUTER">🌐 OpenRouter (openrouter.ai/api/v1)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">اسم المزود:</label>
              <input
                type="text"
                placeholder="مثال: My Custom vLLM / Local Ollama"
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                بروتوكول الـ API ونوع الكومبتيشن (API Protocol / Spec):
              </label>
              <select
                value={newProviderType}
                onChange={(e) => {
                  setNewProviderType(e.target.value);
                  setDetectedHint(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="CUSTOM">🟢 OpenAI-Compatible (الافتراضي لمعظم الشركات: Groq, Together, DeepSeek, Mistral, Ollama)</option>
                <option value="ANTHROPIC">🧠 Anthropic Claude (Messages API / x-api-key)</option>
                <option value="OPENAI">⚡ OpenAI Native (Chat Completions أو Responses API)</option>
                <option value="GEMINI">🔷 Google Gemini (generativelanguage.googleapis.com)</option>
                <option value="OPENROUTER">🌐 OpenRouter (بوابة النماذج الموحدة)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">اسم النموذج (Model Name):</label>
              <input
                type="text"
                placeholder="مثال: llama3.3, mistral-large, gpt-4o, claude-3-5-sonnet"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-semibold">
                  رابط الـ API الأساسي (Base URL أو الرابط كاملاً):
                </label>
                <span className="text-[10px] text-indigo-400 font-mono">✨ كشف تلقائي للبروتوكول</span>
              </div>
              <input
                type="text"
                placeholder="الصق الرابط هنا مثل: https://api.together.xyz/v1 أو https://api.anthropic.com/v1/messages"
                value={newBaseUrl}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  if (text) {
                    setTimeout(() => handleBaseUrlChange(text), 10);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
              {detectedHint && (
                <div className="mt-2 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg shadow-emerald-500/10 animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <span>{detectedHint}</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-200 font-mono">
                    Endpoint: {newCustomEndpoint || '/chat/completions'}
                  </span>
                </div>
              )}
              {/* 1-Click Endpoint Preset Chips */}
              <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">تحديد الـ Endpoint سريعاً:</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewCustomEndpoint('/chat/completions');
                    setNewProviderType('CUSTOM');
                    setDetectedHint('🟢 تم ضبط مسار /chat/completions (OpenAI-Compatible)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    newCustomEndpoint === '/chat/completions' || (!newCustomEndpoint && newProviderType === 'CUSTOM')
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /chat/completions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCustomEndpoint('/messages');
                    setNewProviderType('ANTHROPIC');
                    setDetectedHint('🧠 تم ضبط مسار /messages (Anthropic Claude)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    newCustomEndpoint === '/messages' || newProviderType === 'ANTHROPIC'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /messages (Claude)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCustomEndpoint('/responses');
                    setNewProviderType('OPENAI');
                    setDetectedHint('⚡ تم ضبط مسار /responses (OpenAI Responses)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    newCustomEndpoint === '/responses'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /responses (Responses)
                </button>
              </div>

              <p className="text-[10px] text-slate-500 mt-1">
                💡 إذا لصقت رابط الـ API كاملاً مع الـ endpoint، سيقوم النظام تلقائياً باكتشاف نوع الكومبتيشن وفصل الرابط عن المسار!
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                مفتاح الـ API (مشفر بـ AES-256-GCM):
              </label>
              <input
                type="password"
                placeholder="أدخل مفتاح الـ API هنا (اختياري للنماذج المحلية)"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Advanced Settings Toggle */}
            <div className="border-t border-slate-800/80 pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedAdd(!showAdvancedAdd)}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition"
              >
                <span>{showAdvancedAdd ? '▾ إخفاء الإعدادات المتقدمة' : '▸ إعدادات متقدمة مخصصة (Custom Endpoint & Headers)'}</span>
              </button>

              {showAdvancedAdd && (
                <div className="space-y-3 pt-3 animate-fadeIn">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      مسار الـ Endpoint المخصص (اختياري - افتراضي /chat/completions):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: /chat/completions أو /responses أو /v1/messages"
                      value={newCustomEndpoint}
                      onChange={(e) => setNewCustomEndpoint(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      ترويسات إضافية مخصصة (JSON Headers):
                    </label>
                    <textarea
                      rows={2}
                      placeholder='{"HTTP-Referer": "https://myapp.com", "X-Custom-Key": "secret"}'
                      value={newCustomHeaders}
                      onChange={(e) => setNewCustomHeaders(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateProvider}
                disabled={creatingProvider || !newProviderName || !newModelName}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-50"
              >
                {creatingProvider ? 'جاري الإنشاء...' : 'إضافة وتأمين'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleUp space-y-4">
            <h3 className="text-base font-bold text-white">إعدادات {selectedProvider.name}</h3>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                بروتوكول الـ API ونوع الكومبتيشن (API Protocol / Spec):
              </label>
              <select
                value={editProviderType}
                onChange={(e) => {
                  setEditProviderType(e.target.value);
                  setEditDetectedHint(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="CUSTOM">🟢 OpenAI-Compatible (الافتراضي: Groq, Together, DeepSeek, Mistral, Ollama)</option>
                <option value="ANTHROPIC">🧠 Anthropic Claude (Messages API / x-api-key)</option>
                <option value="OPENAI">⚡ OpenAI Native (Chat Completions أو Responses API)</option>
                <option value="GEMINI">🔷 Google Gemini (generativelanguage.googleapis.com)</option>
                <option value="OPENROUTER">🌐 OpenRouter (بوابة النماذج الموحدة)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">اسم النموذج (Model Name):</label>
              <input
                type="text"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-semibold">
                  Base URL (أو الرابط كاملاً):
                </label>
                <span className="text-[10px] text-indigo-400 font-mono">✨ كشف تلقائي</span>
              </div>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => handleEditBaseUrlChange(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  if (text) {
                    setTimeout(() => handleEditBaseUrlChange(text), 10);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
              {editDetectedHint && (
                <div className="mt-2 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg shadow-emerald-500/10 animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <span>{editDetectedHint}</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-200 font-mono">
                    Endpoint: {customEndpointInput || '/chat/completions'}
                  </span>
                </div>
              )}

              {/* 1-Click Endpoint Preset Chips for Edit */}
              <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">تحديد الـ Endpoint سريعاً:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomEndpointInput('/chat/completions');
                    setEditProviderType('CUSTOM');
                    setEditDetectedHint('🟢 تم ضبط مسار /chat/completions (OpenAI-Compatible)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    customEndpointInput === '/chat/completions' || (!customEndpointInput && editProviderType === 'CUSTOM')
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /chat/completions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomEndpointInput('/messages');
                    setEditProviderType('ANTHROPIC');
                    setEditDetectedHint('🧠 تم ضبط مسار /messages (Anthropic Claude)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    customEndpointInput === '/messages' || editProviderType === 'ANTHROPIC'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /messages (Claude)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomEndpointInput('/responses');
                    setEditProviderType('OPENAI');
                    setEditDetectedHint('⚡ تم ضبط مسار /responses (OpenAI Responses)');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] border transition ${
                    customEndpointInput === '/responses'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  /responses (Responses)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                مفتاح الـ API (مشفر بـ AES-256-GCM):
              </label>
              <input
                type="password"
                placeholder={selectedProvider.hasApiKey ? 'اتركه فارغاً للإبقاء على القديم' : 'أدخل المفتاح هنا'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Advanced Settings Toggle for Edit */}
            <div className="border-t border-slate-800/80 pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition"
              >
                <span>{showAdvancedEdit ? '▾ إخفاء الإعدادات المتقدمة' : '▸ إعدادات متقدمة مخصصة (Custom Endpoint & Headers)'}</span>
              </button>

              {showAdvancedEdit && (
                <div className="space-y-3 pt-3 animate-fadeIn">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      مسار الـ Endpoint المخصص:
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: /chat/completions أو /responses أو /v1/messages"
                      value={customEndpointInput}
                      onChange={(e) => setCustomEndpointInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      ترويسات إضافية مخصصة (JSON Headers):
                    </label>
                    <textarea
                      rows={2}
                      placeholder='{"HTTP-Referer": "https://myapp.com", "X-Custom-Key": "secret"}'
                      value={customHeadersInput}
                      onChange={(e) => setCustomHeadersInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveProvider}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Center Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> مركز المهام وطابور الانتظار (Persistent Queue)
            </h3>
            <p className="text-xs text-slate-400">
              حفظ نقاط الاستئناف (Checkpoints)، إعادة المحاولة التلقائية (Exponential Backoff)، ومراقبة التقدم.
            </p>
          </div>
          <button
            onClick={loadAllData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            تحديث
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">لا توجد مهام حالياً في الطابور.</div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : task.status === 'FAILED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="font-bold text-white">{task.taskType}</span>
                    <span className="text-slate-500 font-mono text-[11px]">#{task.id.slice(0, 8)}</span>
                  </div>

                  {task.lastError && (
                    <div className="text-rose-400/90 text-[11px] mt-1 font-arabic">
                      خطأ: {task.lastError}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">
                      محاولة {task.attemptCount}/{task.maxAttempts}
                    </div>
                    <div className="font-mono text-slate-300 font-bold">{task.progressPercent}%</div>
                  </div>

                  {task.status === 'FAILED' && (
                    <button
                      onClick={() => handleRetryTask(task.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs flex items-center gap-1 font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> إعادة المحاولة
                    </button>
                  )}

                  {task.status === 'RUNNING' && (
                    <button
                      onClick={() => handleCancelTask(task.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-xs"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
