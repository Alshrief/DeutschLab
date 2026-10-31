/**
 * Accurate non-fabricated AI cost calculation per model.
 * Rates per 1 Million tokens in USD.
 */
interface ModelRate {
  inputPerMillion: number;
  outputPerMillion: number;
}

const MODEL_RATES: Record<string, ModelRate> = {
  // Google Gemini
  'gemini-2.5-flash': { inputPerMillion: 0.15, outputPerMillion: 0.60 },
  'gemini-1.5-flash': { inputPerMillion: 0.075, outputPerMillion: 0.30 },
  'gemini-1.5-pro': { inputPerMillion: 1.25, outputPerMillion: 5.00 },
  'gemini-2.5-pro': { inputPerMillion: 1.25, outputPerMillion: 5.00 },

  // OpenAI
  'gpt-4o': { inputPerMillion: 2.50, outputPerMillion: 10.00 },
  'gpt-4o-mini': { inputPerMillion: 0.15, outputPerMillion: 0.60 },
  'o3-mini': { inputPerMillion: 1.10, outputPerMillion: 4.40 },

  // Anthropic
  'claude-3-7-sonnet': { inputPerMillion: 3.00, outputPerMillion: 15.00 },
  'claude-3-5-sonnet': { inputPerMillion: 3.00, outputPerMillion: 15.00 },
  'claude-3-5-haiku': { inputPerMillion: 0.80, outputPerMillion: 4.00 },

  // OpenRouter / DeepSeek
  'deepseek/deepseek-r1': { inputPerMillion: 0.55, outputPerMillion: 2.19 },
  'deepseek/deepseek-chat': { inputPerMillion: 0.14, outputPerMillion: 0.28 },
};

export function calculateEstimatedCostUsd(
  modelName: string,
  inputTokens: number,
  outputTokens: number
): number {
  const normalized = modelName.toLowerCase();
  const rate =
    MODEL_RATES[normalized] ||
    Object.entries(MODEL_RATES).find(([k]) => normalized.includes(k))?.[1] ||
    { inputPerMillion: 0.0, outputPerMillion: 0.0 }; // Default for local models is $0

  const inputCost = (inputTokens / 1_000_000) * rate.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * rate.outputPerMillion;

  return Number((inputCost + outputCost).toFixed(6));
}
