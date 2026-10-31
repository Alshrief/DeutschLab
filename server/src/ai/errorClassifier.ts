export type ErrorCategory =
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'SERVER_ERROR'
  | 'AUTH_ERROR'
  | 'INSUFFICIENT_CREDITS'
  | 'MODEL_NOT_FOUND'
  | 'INVALID_PROMPT'
  | 'UNKNOWN';

export interface ClassifiedError {
  category: ErrorCategory;
  isRetryable: boolean;
  statusCode?: number;
  retryAfterSeconds?: number;
  rawMessage: string;
  humanMessage: string;
  actionableFix: string;
}

export function classifyAiError(error: any, headers?: Headers): ClassifiedError {
  const status = error.status || error.statusCode || error.response?.status;
  const rawMsg = String(error.message || error.error?.message || error || '');
  const lowerMsg = rawMsg.toLowerCase();

  // 1. Check Retry-After header
  let retryAfterSeconds: number | undefined;
  if (headers && headers.has('retry-after')) {
    const rawVal = headers.get('retry-after');
    if (rawVal) {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed)) {
        retryAfterSeconds = parsed;
      }
    }
  }

  // 2. Auth & Credential Failures (Permanent)
  if (status === 401 || lowerMsg.includes('invalid api key') || lowerMsg.includes('unauthorized')) {
    return {
      category: 'AUTH_ERROR',
      isRetryable: false,
      statusCode: 401,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: 'مفتاح الـ API غير صالح أو منتهي الصلاحية.',
      actionableFix: 'تحقق من مفتاح الـ API في لوحة التحكم وتأكد من نسخه بالكامل دون مسافات إضافية.',
    };
  }

  // 3. Billing & Insufficient Credits (Permanent)
  if (status === 402 || lowerMsg.includes('insufficient_quota') || lowerMsg.includes('credit') || lowerMsg.includes('billing')) {
    return {
      category: 'INSUFFICIENT_CREDITS',
      isRetryable: false,
      statusCode: status || 402,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: 'الرصيد في حساب مزود الذكاء الاصطناعي غير كافٍ.',
      actionableFix: 'اشحن رصيد حسابك لدى المزود أو استخدم مزوداً بديلاً (مثل Gemini المجاني أو نموذج محلي).',
    };
  }

  // 4. Model Not Found (Permanent)
  if (status === 404 || lowerMsg.includes('model not found') || lowerMsg.includes('does not exist')) {
    return {
      category: 'MODEL_NOT_FOUND',
      isRetryable: false,
      statusCode: 404,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: 'اسم النموذج المحدد غير موجود أو غير متاح في هذا الحساب.',
      actionableFix: 'اختر نموذجاً مدعوماً من القائمة المنسدلة (مثل gemini-2.5-flash أو gpt-4o-mini).',
    };
  }

  // 5. Rate Limits (Retryable)
  if (status === 429 || lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
    return {
      category: 'RATE_LIMIT',
      isRetryable: true,
      statusCode: 429,
      retryAfterSeconds: retryAfterSeconds || 5,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: 'تم تجاوز الحد الأقصى لمعدل الطلبات في الدقيقة (Rate Limit).',
      actionableFix: 'النظام يعيد المحاولة تلقائياً بعد فترة التهدئة المحددة.',
    };
  }

  // 6. Timeouts & Network Failures (Retryable)
  if (
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('econnreset') ||
    lowerMsg.includes('econnrefused') ||
    lowerMsg.includes('fetch failed') ||
    lowerMsg.includes('network')
  ) {
    return {
      category: 'TIMEOUT',
      isRetryable: true,
      statusCode: 408,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: 'انقطاع مؤقت في الاتصال بالشبكة أو انتهاء مهلة الخادم.',
      actionableFix: 'سيتم إعادة المحاولة فوراً بنظام التراجع الأسي.',
    };
  }

  // 7. Server Errors (5xx, Retryable)
  if (status && status >= 500 && status <= 599) {
    return {
      category: 'SERVER_ERROR',
      isRetryable: true,
      statusCode: status,
      rawMessage: sanitizeErrorMessage(rawMsg),
      humanMessage: `خطأ في خوادم مزود الـ AI (${status}).`,
      actionableFix: 'خوادم المزود تواجه ضغطاً مؤقتاً، جاري إعادة المحاولة تلقائياً.',
    };
  }

  // Default Fallback
  return {
    category: 'UNKNOWN',
    isRetryable: false,
    statusCode: status,
    rawMessage: sanitizeErrorMessage(rawMsg),
    humanMessage: 'حدث خطأ غير متوقع أثناء معالجة الطلب.',
    actionableFix: 'راجع تفاصيل الخطأ في مركز المهام أو أعد تشغيل المهمة يدوياً.',
  };
}

/**
 * Removes sensitive tokens, keys, and authorization headers from error messages before storage.
 */
export function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]{15,}/gi, '$1[REDACTED]')
    .replace(/(key=)[A-Za-z0-9_\-\.]{15,}/gi, '$1[REDACTED]')
    .replace(/(sk-[A-Za-z0-9_\-\.]{15,})/gi, 'sk-[REDACTED]');
}
