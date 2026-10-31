/**
 * FSRS (Free Spaced Repetition Scheduler) Adaptive Algorithm Implementation.
 * Optimized for German vocabulary, grammatical cases, and conjugations.
 */

export type FsrsRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface FsrsCardState {
  state: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview?: Date;
  nextReview: Date;
}

// Default FSRS Parameters
const W = [
  0.4072, 1.1827, 3.1262, 15.4722, // Initial stabilities for ratings 1..4
  7.2102, // Initial difficulty
  0.5316, // Difficulty weight
  1.0651, // Difficulty mean reversion
  0.0234, // Difficulty change rate
  1.616, // Stability after recall exponent
  0.1544, // Stability after recall difficulty factor
  1.0819, // Stability after recall stability factor
  1.9813, // Stability after failure exponent
  0.0953, // Stability after failure difficulty factor
  0.2975, // Stability after failure stability factor
  0.2204, // Retrievability decay
  2.9466, // Hard interval multiplier
  0.5034, // Easy interval multiplier
];

export class FsrsEngine {
  /**
   * Initializes a new FSRS card.
   */
  static createNewCard(): FsrsCardState {
    return {
      state: 'NEW',
      stability: 0,
      difficulty: W[4],
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      nextReview: new Date(),
    };
  }

  /**
   * Evaluates a review response and calculates next stability, difficulty, and review interval.
   */
  static reviewCard(current: FsrsCardState, rating: FsrsRating, reviewDate = new Date()): FsrsCardState {
    let nextStability = current.stability;
    let nextDifficulty = current.difficulty;
    let nextState = current.state;
    let nextLapses = current.lapses;

    const daysSinceLast = current.lastReview
      ? Math.max(0, Math.floor((reviewDate.getTime() - current.lastReview.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    if (current.state === 'NEW') {
      // First review
      nextStability = W[rating - 1];
      nextDifficulty = Math.min(10, Math.max(1, W[4] - Math.exp(W[5] * (rating - 1)) + 1));
      nextState = rating === 1 ? 'LEARNING' : 'REVIEW';
    } else {
      // Subsequent review
      if (rating === 1) {
        // Lapse / Failed recall
        nextLapses += 1;
        nextState = 'RELEARNING';
        nextStability = Math.max(0.1, W[11] * Math.pow(current.difficulty, -W[12]) * Math.pow(current.stability + 1, W[13]) * Math.exp(W[14] * (1 - 0.9)));
      } else {
        // Successful recall (Hard, Good, Easy)
        nextState = 'REVIEW';
        const hardPenalty = rating === 2 ? W[15] : 1;
        const easyBonus = rating === 4 ? W[16] : 1;

        nextStability =
          current.stability *
          (1 +
            Math.exp(W[8]) *
              (11 - current.difficulty) *
              Math.pow(current.stability, -W[9]) *
              (Math.exp((1 - 0.9) * W[10]) - 1) *
              hardPenalty *
              easyBonus);
      }

      // Update Difficulty with mean reversion
      const deltaD = -W[6] * (rating - 3);
      nextDifficulty = Math.min(10, Math.max(1, current.difficulty + deltaD));
    }

    // Calculate scheduled days
    let scheduledDays = 1;
    if (nextState === 'REVIEW') {
      const factor = 9 * (1 / 0.9 - 1); // For 90% target retention
      scheduledDays = Math.max(1, Math.round(nextStability * factor));
    } else if (rating === 4) {
      scheduledDays = 3;
    }

    const nextReview = new Date(reviewDate.getTime() + scheduledDays * 24 * 60 * 60 * 1000);

    return {
      state: nextState,
      stability: Number(nextStability.toFixed(4)),
      difficulty: Number(nextDifficulty.toFixed(2)),
      elapsedDays: daysSinceLast,
      scheduledDays,
      reps: current.reps + 1,
      lapses: nextLapses,
      lastReview: reviewDate,
      nextReview,
    };
  }
}
