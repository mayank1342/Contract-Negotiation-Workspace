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

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI GPT-4o Provider';
  private fallbackProvider = new DemoAIProvider();

  private apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;

  async analyzeContract(content: string, type: string): Promise<ContractAnalysisResult> {
    if (!this.apiKey) return this.fallbackProvider.analyzeContract(content, type);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert contract risk analyst. Return JSON matching ContractAnalysisResult schema.',
            },
            { role: 'user', content: `Analyze contract type "${type}":\n${content}` },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    } catch {
      return this.fallbackProvider.analyzeContract(content, type);
    }
  }

  async extractClauses(content: string, type: string): Promise<ExtractedClause[]> {
    if (!this.apiKey) return this.fallbackProvider.extractClauses(content, type);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Extract key clauses and risk levels from contract. Return JSON array of ExtractedClause.',
            },
            { role: 'user', content: `Extract clauses from "${type}":\n${content}` },
          ],
        }),
      });
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } catch {
      return this.fallbackProvider.extractClauses(content, type);
    }
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
