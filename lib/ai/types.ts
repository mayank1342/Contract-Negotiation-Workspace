export interface ContractAnalysisResult {
  overallRisk: number;
  financialRisk: number;
  terminationRisk: number;
  liabilityRisk: number;
  paymentRisk: number;
  ipRisk: number;
  summary: string;
  keyRisks: Array<{
    type: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    title: string;
    description: string;
    recommendation: string;
  }>;
}

export interface ExtractedClause {
  title: string;
  text: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  simpleExplanation: string;
  proExplanation: string;
  studentExplanation: string;
  whyItMatters: string;
  suggestedImprovement: string;
  negotiationStrategy: string;
}

export interface NegotiationState {
  id: string;
  contractType: string;
  userRole: string;
  opponentRole: string;
  opponentStyle: 'Friendly' | 'Professional' | 'Aggressive' | 'Difficult';
  goal: string;
  targetValue: number;
  minimumValue: number;
  batnaValue: number;
  zopaMin: number;
  zopaMax: number;
  currentOffer: {
    salary: number;
    duration: string;
    noticePeriod: string;
    paymentTerms: string;
  };
  roundNumber: number;
  messages: Array<{
    sender: 'USER' | 'OPPONENT' | 'SYSTEM' | 'COACH';
    text: string;
    roundNumber: number;
  }>;
  offersHistory: Array<{
    offerBy: 'USER' | 'OPPONENT';
    salary: number;
    duration: string;
    noticePeriod: string;
    paymentTerms: string;
    status: string;
    roundNumber: number;
  }>;
  concessions: Array<{
    madeBy: 'USER' | 'OPPONENT';
    description: string;
    valueGained: number;
    valueGiven: number;
    roundNumber: number;
  }>;
}

export interface OpponentResponse {
  message: string;
  counterOffer?: {
    salary: number;
    duration: string;
    noticePeriod: string;
    paymentTerms: string;
  };
  isAgreed: boolean;
  isFailed: boolean;
  concessionGiven?: {
    description: string;
    valueGained: number;
  };
}

export interface CoachAdvice {
  positionScore: number;
  opponentScore: number;
  currentOfferText: string;
  negotiationPower: 'HIGH' | 'BALANCED' | 'WEAK';
  recommendation: string;
  suggestedResponse: string;
  riskAlert?: string;
  tacticalTip: string;
}

export interface NegotiationScoreResult {
  overallScore: number;
  communicationScore: number;
  preparationScore: number;
  priceScore: number;
  riskScore: number;
  concessionScore: number;
  strategyScore: number;
  strengths: string[];
  weaknesses: string[];
  valueSaved: number;
}
