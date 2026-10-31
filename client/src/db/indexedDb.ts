import Dexie, { type Table } from 'dexie';
import type { VocabularyItem, GrammarRuleItem, FsrsCard } from '../types/index.js';

export interface OfflineSyncQueueItem {
  id?: number;
  action: 'UPDATE_FSRS' | 'CREATE_VOCAB' | 'UPDATE_VOCAB' | 'COMPLETE_DRILL';
  payload: any;
  createdAt: number;
  synced: boolean;
}

export class DeutschLabDatabase extends Dexie {
  vocabularies!: Table<VocabularyItem, string>;
  grammarRules!: Table<GrammarRuleItem, string>;
  fsrsQueue!: Table<FsrsCard, string>;
  syncQueue!: Table<OfflineSyncQueueItem, number>;

  constructor() {
    super('DeutschLabOfflineDB');
    this.version(1).stores({
      vocabularies: 'id, lemma, word, article, cefrLevel, status',
      grammarRules: 'id, slug, cefrLevel, category',
      fsrsQueue: 'id, itemType, referenceId, state, nextReview',
      syncQueue: '++id, action, createdAt, synced',
    });
  }
}

export const offlineDb = new DeutschLabDatabase();
