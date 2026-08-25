import {
  ContractAnalysisResult,
  ExtractedClause,
  NegotiationState,
  OpponentResponse,
  CoachAdvice,
  NegotiationScoreResult,
} from './types';

export interface AIProvider {
  name: string;
  analyzeContract(content: string, type: string): Promise<ContractAnalysisResult>;
  extractClauses(content: string, type: string): Promise<ExtractedClause[]>;
  explainClause(clauseText: string, mode: 'simple' | 'pro' | 'student'): Promise<string>;
  rewriteClause(clauseText: string, instruction: string): Promise<string>;
  generateCounterOffer(state: NegotiationState, userMessage: string): Promise<OpponentResponse>;
  generateCoachAdvice(state: NegotiationState): Promise<CoachAdvice>;
  scoreNegotiation(state: NegotiationState): Promise<NegotiationScoreResult>;
  generateFinalContract(originalContent: string, agreedTerms: any): Promise<string>;
}
