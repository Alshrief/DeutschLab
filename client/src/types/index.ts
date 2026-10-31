export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2';

export type Article = 'DER' | 'DIE' | 'DAS' | 'NONE';

export type WordStatus = 'NEW' | 'LEARNING' | 'MASTERED' | 'NEEDS_REVIEW';

export type AiProviderType = 'GEMINI' | 'OPENAI' | 'ANTHROPIC' | 'OPENROUTER' | 'CUSTOM';

export type AiConnectionStatus = 'AI Connected' | 'No AI Key' | 'Offline Mode' | 'API Error';

export interface AiProvider {
  id: string;
  name: string;
  providerType: AiProviderType;
  baseUrl?: string;
  customEndpoint?: string;
  modelName: string;
  isActive: boolean;
  isDefault: boolean;
  latencyMs?: number;
  testStatus: 'UNTESTED' | 'SUCCESS' | 'FAILED';
  testError?: string;
}

export interface SentenceItem {
  id: string;
  sentenceNumber: number;
  sentenceDe: string;
  sentenceAr: string;
  grammaticalBreakdown: Record<string, any>;
  verbAssociation?: string;
  cefrLevel: CefrLevel;
}

export interface VocabularyItem {
  id: string;
  lemma: string;
  word: string;
  article?: Article;
  plural?: string;
  partOfSpeech: string;
  cefrLevel: CefrLevel;
  arabicTranslation: string;
  englishTranslation?: string;
  ipaPhonetics?: string;
  colorCode?: string;
  verbConjugations?: Record<string, any>;
  governingCases?: string[];
  status: WordStatus;
  sentenceHistories?: SentenceItem[];
}

export interface GrammarRuleItem {
  id: string;
  title: string;
  slug: string;
  cefrLevel: CefrLevel;
  category: string;
  formulaSyntax: string;
  explanationMarkdown: string;
  arabicExplanationMarkdown: string;
  examples: Array<{ de: string; ar: string; caseInfo?: string }>;
}

export interface FsrsCard {
  id: string;
  itemType: 'VOCABULARY' | 'GRAMMAR_RULE';
  referenceId: string;
  state: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview?: string;
  nextReview: string;
}
