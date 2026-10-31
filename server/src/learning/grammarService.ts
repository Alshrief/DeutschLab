import prisma from '../prisma.js';
import { executeAiCompletion } from '../ai/aiClient.js';

export interface AiXRayAnalysisRequest {
  sentenceDe: string;
  learnerLevel?: string;
  context?: string;
  providerId?: string;
}

export class GrammarService {
  /**
   * "AI X-Ray" Surgical Error Correction:
   * Analyzes a German sentence, exposes every single case/order/gender error,
   * explains why it failed, and provides the exact correct syntax tree in German and Arabic.
   */
  static async analyzeSentenceXRay(request: AiXRayAnalysisRequest) {
    const prompt = `Perform a rigorous, surgical grammatical analysis ("AI X-Ray") on this German sentence submitted by a ${request.learnerLevel || 'A1'} learner:
"${request.sentenceDe}"

Task:
1. Is the sentence 100% grammatically correct? (boolean)
2. Corrected version of the sentence.
3. List of every grammatical mistake (Cases: Nominativ/Akkusativ/Dativ/Genitiv, Word Order: Verb Position 2 / TeKaMoLo / Endstellung, Adjective Endings, Gender/Articles, Verb Conjugation).
4. For each mistake:
   - exactWord: The word or phrase that is wrong
   - errorType: "CASE_ERROR" | "WORD_ORDER" | "CONJUGATION" | "GENDER" | "PREPOSITION"
   - grammaticalRule: The exact German rule breached
   - surgicalExplanationDe: Concise German explanation
   - surgicalExplanationAr: Crystal-clear Arabic grammatical explanation explaining why and what the case/rule requires
5. Visual Syntax Matrix / Diagram Breakdown:
   - slots: Array of sentence segments [{ pos: "Position 1", word: "...", function: "Subjekt / Temporal", case: "Nominativ" }]
6. Encouraging teacher feedback in Arabic.

Respond ONLY with valid JSON in this exact structure:
{
  "isCorrect": false,
  "correctedSentence": "...",
  "mistakes": [
    {
      "exactWord": "...",
      "errorType": "...",
      "grammaticalRule": "...",
      "surgicalExplanationDe": "...",
      "surgicalExplanationAr": "..."
    }
  ],
  "syntaxMatrix": [
    {
      "position": "...",
      "word": "...",
      "function": "...",
      "case": "..."
    }
  ],
  "teacherFeedbackAr": "..."
}`;

    const completion = await executeAiCompletion({
      providerId: request.providerId,
      systemPrompt: 'You are an uncompromising German grammar professor and linguistic diagnostician.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.1,
    });

    return JSON.parse(completion.text);
  }

  /**
   * Generates targeted drills for a specific grammar rule and CEFR level.
   */
  static async generateDrillsForRule(grammarRuleId: string, count = 3, providerId?: string) {
    const rule = await prisma.grammarRule.findUnique({ where: { id: grammarRuleId } });
    if (!rule) throw new Error('Grammar rule not found.');

    const prompt = `Generate ${count} interactive German grammar drill questions testing the rule: "${rule.title}" (CEFR ${rule.cefrLevel}).
Formula: ${rule.formulaSyntax}

Each question should have:
- drillType: "FILL_IN_BLANK" | "CASE_SELECTION" | "REORDER_WORDS"
- questionDe: The German question or sentence with "___"
- promptAr: The question prompt in Arabic
- options: 4 distinct choices (strings)
- correctAnswer: The exact correct choice
- explanationAr: Direct explanation in Arabic why this answer is correct

Output ONLY JSON:
{
  "drills": [
    {
      "drillType": "...",
      "questionDe": "...",
      "promptAr": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "...",
      "explanationAr": "..."
    }
  ]
}`;

    const completion = await executeAiCompletion({
      providerId,
      systemPrompt: 'You are a German test author producing CEFR-aligned drills.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.text);
    const createdDrills = [];

    for (const d of parsed.drills || []) {
      const created = await prisma.grammarDrill.create({
        data: {
          grammarRuleId,
          cefrLevel: rule.cefrLevel,
          drillType: d.drillType,
          questionDe: d.questionDe,
          promptAr: d.promptAr,
          options: JSON.stringify(d.options),
          correctAnswer: d.correctAnswer,
          explanationAr: d.explanationAr,
          difficulty: 1,
        },
      });
      createdDrills.push(created);
    }

    return createdDrills;
  }
}
