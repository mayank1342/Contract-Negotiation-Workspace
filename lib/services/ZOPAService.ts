export interface ZOPAAnalysis {
  zopaMin: number;
  zopaMax: number;
  hasZopa: boolean;
  overlapAmount: number;
  suggestedTargetRange: string;
  nonPriceTradeSuggestions: string[];
}

export class ZOPAService {
  static calculateZOPA(userMinimum: number, opponentMaxBudget: number): ZOPAAnalysis {
    const hasZopa = opponentMaxBudget >= userMinimum;
    const overlapAmount = hasZopa ? opponentMaxBudget - userMinimum : 0;

    const zopaMin = Math.min(userMinimum, opponentMaxBudget);
    const zopaMax = Math.max(userMinimum, opponentMaxBudget);

    const formatInK = (val: number) => `₹${Math.round(val / 1000)}k`;

    const nonPriceTradeSuggestions = [
      'Reduce notice period from 90 days to 30 days',
      'Request flexible work-from-home or remote work terms',
      'Include a 6-month performance review & bonus clause',
      'Net 15 payment cycle instead of Net 60',
      'Explicit IP exclusion for pre-existing personal projects',
    ];

    return {
      zopaMin,
      zopaMax,
      hasZopa,
      overlapAmount,
      suggestedTargetRange: hasZopa
        ? `${formatInK(zopaMin)} — ${formatInK(zopaMax)}`
        : 'NO DIRECT OVERLAP',
      nonPriceTradeSuggestions,
    };
  }
}
