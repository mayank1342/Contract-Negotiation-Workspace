export interface BATNAAnalysis {
  batnaValue: number;
  currentOfferValue: number;
  isOfferSuperior: boolean;
  deltaAmount: number;
  deltaPercentage: number;
  statusLabel: string;
  statusColor: string;
  recommendation: string;
}

export class BATNAService {
  static evaluateBATNA(currentOfferSalary: number, batnaSalary: number): BATNAAnalysis {
    const deltaAmount = currentOfferSalary - batnaSalary;
    const deltaPercentage = batnaSalary > 0 ? (deltaAmount / batnaSalary) * 100 : 0;
    const isOfferSuperior = deltaAmount >= 0;

    let statusLabel = '';
    let statusColor = '';
    let recommendation = '';

    if (deltaAmount > 0) {
      statusLabel = 'CURRENT DEAL EXCEEDS BATNA';
      statusColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      recommendation = `The current offer exceeds your alternative option by ${deltaPercentage.toFixed(1)}%. You hold a favorable position to close or request final minor enhancements.`;
    } else if (deltaAmount === 0) {
      statusLabel = 'CURRENT DEAL EQUALS BATNA';
      statusColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      recommendation = 'The current offer is identical to your fallback option. Require non-monetary concessions (e.g. flexible hours or shorter notice) before agreeing.';
    } else {
      statusLabel = 'CURRENT DEAL IS WORSE THAN BATNA';
      statusColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      recommendation = `Current offer is ₹${Math.abs(deltaAmount).toLocaleString('en-IN')} below your fallback option. DO NOT ACCEPT without counter-proposing or walking away to your alternative.`;
    }

    return {
      batnaValue: batnaSalary,
      currentOfferValue: currentOfferSalary,
      isOfferSuperior,
      deltaAmount,
      deltaPercentage,
      statusLabel,
      statusColor,
      recommendation,
    };
  }
}
