import { decryptApiKey } from '../security/encryption.js';
import { validateSafeUrl } from '../security/ssrfGuard.js';
import { classifyAiError } from './errorClassifier.js';
import { calculateEstimatedCostUsd } from './costCalculator.js';
import prisma from '../prisma.js';

export interface AiRequestOptions {
  providerId?: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  taskId?: string;
}

export interface AiResponseResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  providerType: string;
  modelName: string;
}

/**
 * Unified AI Client with multi-provider dispatch, token metrics, and SSRF validation.
 */
export async function executeAiCompletion(
  options: AiRequestOptions
): Promise<AiResponseResult> {
  const startTime = Date.now();

  // 1. Resolve Provider
  let provider;
  if (options.providerId) {
    provider = await prisma.aiProvider.findUnique({ where: { id: options.providerId } });
  } else {
    // Pick default active provider
    provider = await prisma.aiProvider.findFirst({
      where: { isDefault: true, isActive: true },
    });
    if (!provider) {
      provider = await prisma.aiProvider.findFirst({ where: { isActive: true } });
    }
  }

  if (!provider) {
    throw new Error('No active AI Provider configured. Please configure an AI Provider in Settings.');
  }

  // 2. Decrypt API Key if present
  let apiKey = '';
  if (provider.encryptedApiKey && provider.apiKeyIv && provider.apiKeyTag) {
    apiKey = decryptApiKey(provider.encryptedApiKey, provider.apiKeyIv, provider.apiKeyTag);
  }

  // 3. SSRF Check on Custom Endpoints
  const baseUrl = provider.baseUrl || 'https://api.openai.com/v1';
  if (provider.providerType === 'CUSTOM') {
    const isSafe = await validateSafeUrl(baseUrl, true);
    if (!isSafe.isSafe) {
      throw new Error(`SSRF Security Guard blocked request to custom provider: ${isSafe.reason}`);
    }
  }

  const model = provider.modelName;

  try {
    let resultText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    if (provider.providerType === 'GEMINI') {
      const url = `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const body = {
        contents: [
          ...(options.systemPrompt
            ? [{ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${options.systemPrompt}` }] }]
            : []),
          { role: 'user', parts: [{ text: options.userPrompt }] },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.3,
          maxOutputTokens: options.maxTokens ?? 4096,
          responseMimeType: options.jsonMode ? 'application/json' : 'text/plain',
        },
      };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errJson = (await resp.json().catch(() => ({}))) as any;
        throw { status: resp.status, message: errJson?.error?.message || resp.statusText };
      }

      const data = (await resp.json()) as any;
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      inputTokens = data.usageMetadata?.promptTokenCount || Math.ceil(options.userPrompt.length / 4);
      outputTokens = data.usageMetadata?.candidatesTokenCount || Math.ceil(resultText.length / 4);
    } else if (provider.providerType === 'ANTHROPIC') {
      // Native Anthropic Messages API
      const cleanBase = baseUrl.replace(/\/+$/, '');
      const fullUrl = cleanBase.endsWith('/v1') ? `${cleanBase}/messages` : `${cleanBase}/v1/messages`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      };
      if (provider.customHeaders) {
        try {
          const parsed = JSON.parse(provider.customHeaders);
          Object.assign(headers, parsed);
        } catch {}
      }

      const body: any = {
        model,
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.3,
        messages: [{ role: 'user', content: options.userPrompt }],
      };
      if (options.systemPrompt) {
        body.system = options.systemPrompt;
      }

      const resp = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errJson = (await resp.json().catch(() => ({}))) as any;
        throw { status: resp.status, message: errJson?.error?.message || resp.statusText };
      }

      const data = (await resp.json()) as any;
      resultText = data.content?.map((part: any) => part.text || '').join('') || '';
      inputTokens = data.usage?.input_tokens || Math.ceil(options.userPrompt.length / 4);
      outputTokens = data.usage?.output_tokens || Math.ceil(resultText.length / 4);
    } else {
      // OpenAI (Chat Completions & Responses API) / Ollama / Mistral / Groq / DeepSeek / OpenRouter / Custom
      const cleanBase = baseUrl.replace(/\/+$/, '');
      const endpoint = provider.customEndpoint || '/chat/completions';
      const fullUrl = cleanBase.endsWith('/v1') ? `${cleanBase}${endpoint}` : `${cleanBase}/v1${endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      if (provider.providerType === 'OPENROUTER') {
        headers['HTTP-Referer'] = 'https://deutschlab.internal';
        headers['X-Title'] = 'DeutschLab';
      }
      if (provider.customHeaders) {
        try {
          const parsedHeaders = JSON.parse(provider.customHeaders);
          Object.assign(headers, parsedHeaders);
        } catch {
          // Ignore invalid header json
        }
      }

      // Check if Responses API is targeted
      if (endpoint === '/responses') {
        const resp = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            input: options.userPrompt,
            instructions: options.systemPrompt,
          }),
        });

        if (!resp.ok) {
          const errJson = (await resp.json().catch(() => ({}))) as any;
          throw { status: resp.status, message: errJson?.error?.message || resp.statusText };
        }

        const data = (await resp.json()) as any;
        resultText = data.output_text || data.output?.[0]?.content?.[0]?.text || '';
        inputTokens = data.usage?.input_tokens || Math.ceil(options.userPrompt.length / 4);
        outputTokens = data.usage?.output_tokens || Math.ceil(resultText.length / 4);
      } else {
        // Standard /chat/completions (OpenAI, Ollama, Mistral, Groq, DeepSeek, etc.)
        const messages = [];
        if (options.systemPrompt) {
          messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: options.userPrompt });

        const resp = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages,
            temperature: options.temperature ?? 0.3,
            max_tokens: options.maxTokens ?? 4096,
            response_format: options.jsonMode ? { type: 'json_object' } : undefined,
          }),
        });

        if (!resp.ok) {
          const errJson = (await resp.json().catch(() => ({}))) as any;
          throw { status: resp.status, message: errJson?.error?.message || resp.statusText };
        }

        const data = (await resp.json()) as any;
        resultText = data.choices?.[0]?.message?.content || '';
        inputTokens = data.usage?.prompt_tokens || Math.ceil(options.userPrompt.length / 4);
        outputTokens = data.usage?.completion_tokens || Math.ceil(resultText.length / 4);
      }
    }

    const latencyMs = Date.now() - startTime;
    const totalTokens = inputTokens + outputTokens;
    const estimatedCostUsd = calculateEstimatedCostUsd(model, inputTokens, outputTokens);

    // Record AI Usage Log
    await prisma.aiUsageLog.create({
      data: {
        providerId: provider.id,
        taskId: options.taskId || null,
        modelName: model,
        taskType: 'COMPLETION',
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd,
        latencyMs,
        isSuccess: true,
      },
    });

    return {
      text: resultText,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd,
      latencyMs,
      providerType: provider.providerType,
      modelName: model,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const classified = classifyAiError(err);

    // Log failed attempt in usage logs
    await prisma.aiUsageLog.create({
      data: {
        providerId: provider.id,
        taskId: options.taskId || null,
        modelName: model,
        taskType: 'COMPLETION',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        latencyMs,
        isSuccess: false,
        errorCode: String(classified.statusCode || classified.category),
        errorMessage: classified.rawMessage,
      },
    });

    throw classified;
  }
}
