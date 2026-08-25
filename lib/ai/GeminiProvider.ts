import { AIProvider } from './AIProvider';
import { DemoAIProvider } from './DemoAIProvider';
import {
  ContractAnalysisResult,
  ExtractedClause,
  NegotiationState,
  OpponentResponse,
  CoachAdvice,
  NegotiationScoreResult,
} from './types';

export class GeminiProvider implements AIProvider {
  name = 'Gemini 1.5 Pro Provider';
  private fallbackProvider = new DemoAIProvider();

  private apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  async analyzeContract(content: string, type: string): Promise<ContractAnalysisResult> {
    if (!this.apiKey) return this.fallbackProvider.analyzeContract(content, type);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze contract type ${type} and return JSON:\n${content}` }] }],
        }),
      });
      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      return JSON.parse(text);
    } catch {
      return this.fallbackProvider.analyzeContract(content, type);
    }
  }

  async extractClauses(content: string, type: string): Promise<ExtractedClause[]> {
    return this.fallbackProvider.extractClauses(content, type);
  }

  async explainClause(clauseText: string, mode: 'simple' | 'pro' | 'student'): Promise<string> {
    return this.fallbackProvider.explainClause(clauseText, mode);
  }

  async rewriteClause(clauseText: string, instruction: string): Promise<string> {
    return this.fallbackProvider.rewriteClause(clauseText, instruction);
  }

  async generateCounterOffer(state: NegotiationState, userMessage: string): Promise<OpponentResponse> {
    return this.fallbackProvider.generateCounterOffer(state, userMessage);
  }

  async generateCoachAdvice(state: NegotiationState): Promise<CoachAdvice> {
    return this.fallbackProvider.generateCoachAdvice(state);
  }

  async scoreNegotiation(state: NegotiationState): Promise<NegotiationScoreResult> {
    return this.fallbackProvider.scoreNegotiation(state);
  }

  async generateFinalContract(originalContent: string, agreedTerms: any): Promise<string> {
    return this.fallbackProvider.generateFinalContract(originalContent, agreedTerms);
  }
}
