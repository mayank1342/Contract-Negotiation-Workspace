import { AIProvider } from './AIProvider';
import {
  ContractAnalysisResult,
  ExtractedClause,
  NegotiationState,
  OpponentResponse,
  CoachAdvice,
  NegotiationScoreResult,
} from './types';

export class DemoAIProvider implements AIProvider {
  name = 'Demo AI Engine (Offline Rule-Based)';

  async analyzeContract(content: string, type: string): Promise<ContractAnalysisResult> {
    const isEmployment = type.toLowerCase().includes('employment') || content.toLowerCase().includes('salary');
    const isFreelance = type.toLowerCase().includes('freelance') || content.toLowerCase().includes('client');
    
    return {
      overallRisk: isEmployment ? 74 : 68,
      financialRisk: isEmployment ? 80 : 65,
      terminationRisk: 85,
      liabilityRisk: 72,
      paymentRisk: isFreelance ? 78 : 60,
      ipRisk: 70,
      summary: `High overall risk detected in ${type}. Key concerns involve unilateral termination clauses, mandatory 90-day notice periods, and broad IP assignment provisions without royalty sharing.`,
      keyRisks: [
        {
          type: 'Termination',
          level: 'HIGH',
          title: 'Unilateral Immediate Termination',
          description: 'Employer/Client can terminate without cause in 3 days, while you require 90 days notice.',
          recommendation: 'Negotiate mutual 30-day notice period with severance payment.',
        },
        {
          type: 'Financial',
          level: 'HIGH',
          title: 'Delayed Payment Terms (90 Days)',
          description: 'Payment cycle is set to Net 90 days after invoice approval.',
          recommendation: 'Negotiate Net 30 terms with a 1.5% monthly late fee clause.',
        },
        {
          type: 'Liability',
          level: 'MEDIUM',
          title: 'Unlimited Indemnification Liability',
          description: 'You assume full indemnification for all third-party IP claims without liability cap.',
          recommendation: 'Cap maximum liability to 1x contract value.',
        },
      ],
    };
  }

  async extractClauses(content: string, type: string): Promise<ExtractedClause[]> {
    return [
      {
        title: 'Compensation & Payment Schedule',
        text: 'The Employer agrees to pay the Employee a salary of ₹60,000 per month, payable on a Net 60 days cycle post performance review.',
        category: 'Financial',
        riskLevel: 'HIGH',
        simpleExplanation: 'You are paid ₹60,000 per month, but payments will be delayed by 2 months.',
        proExplanation: 'Base monthly compensation is ₹60,000, subject to an extended 60-day disbursement window tied to subjective evaluation.',
        studentExplanation: 'Imagine working in January but only receiving your salary check in late March after your boss reviews your work.',
        whyItMatters: 'Extended payment terms harm cash flow and create financial leverage imbalance.',
        suggestedImprovement: 'Change payment terms to 1st of every month without conditional performance holds.',
        negotiationStrategy: 'Highlight industry standards for monthly payroll and request Net 15 or 1st day payment.',
      },
      {
        title: 'Termination & Notice Period',
        text: 'Either party may terminate this agreement with 90 days written notice. The Company reserves the right to terminate immediately for convenience upon payment of 1 week salary.',
        category: 'Termination',
        riskLevel: 'HIGH',
        simpleExplanation: 'You must give 3 months notice to leave, but the company can fire you with only 1 week pay.',
        proExplanation: 'Asymmetric termination provisions create an unfair obligation imbalance favor of the employer.',
        studentExplanation: 'If you want to leave, you are stuck for 3 full months. If they fire you, you only get 1 week salary.',
        whyItMatters: 'Extremely one-sided and restricts career mobility.',
        suggestedImprovement: 'Equalize notice period to 30 days for both parties with 1 month severance pay.',
        negotiationStrategy: 'Frame mutual 30 days notice as standard professional practice.',
      },
      {
        title: 'Intellectual Property Assignment',
        text: 'All inventions, software, code, and works created by the Individual during the term, whether during work hours or personal time, belong exclusively to the Company.',
        category: 'Intellectual Property',
        riskLevel: 'HIGH',
        simpleExplanation: 'Anything you build, even projects in your free time on weekends, belongs to the company.',
        proExplanation: 'Overbroad IP scope includes pre-existing work and off-duty creation without carve-out exclusions.',
        studentExplanation: 'If you make a mobile game on your laptop at 2 AM on a Sunday, the company owns it entirely.',
        whyItMatters: 'Prevents personal projects, open source contributions, or side freelancing.',
        suggestedImprovement: 'Limit IP transfer strictly to work done directly for the company using company equipment.',
        negotiationStrategy: 'Request explicit Schedule A listing of pre-existing personal inventions.',
      },
      {
        title: 'Non-Compete & Restrictive Covenant',
        text: 'For a period of 24 months post-termination, the Employee shall not work for any competitor globally.',
        category: 'Non-Compete',
        riskLevel: 'MEDIUM',
        simpleExplanation: 'You cannot work for any competitor worldwide for 2 full years after leaving.',
        proExplanation: 'Global 2-year non-compete clause may be legally unenforceable in many jurisdictions but creates litigation risk.',
        studentExplanation: 'You cannot get another job in your domain for 2 years after leaving this company.',
        whyItMatters: 'Significantly restricts future job options in your industry.',
        suggestedImprovement: 'Reduce duration to 6 months within a 50 km geographic radius.',
        negotiationStrategy: 'Offer non-solicitation of clients instead of a blanket non-compete.',
      },
    ];
  }

  async explainClause(clauseText: string, mode: 'simple' | 'pro' | 'student'): Promise<string> {
    if (mode === 'simple') {
      return `Simple Summary: This clause outlines the exact rules and duties for both parties. In short, it requires compliance and sets penalties if broken.`;
    } else if (mode === 'student') {
      return `Student Explanation: Think of this clause like a school rulebook contract: if you agree to it, you must follow the rules, or you lose points (or face penalties).`;
    } else {
      return `Professional Analysis: Legally binding provision establishing affirmative covenants, liability boundaries, and contractual remedies in accordance with standard contract law principles.`;
    }
  }

  async rewriteClause(clauseText: string, instruction: string): Promise<string> {
    return `MODIFIED CLAUSE (${instruction}):\n"Both parties agree to a mutual 30-day notice period for termination without cause. Payment shall be remitted on a Net 15 basis. Liability shall be capped at the total amount paid under this agreement in the preceding 12 months."`;
  }

  async generateCounterOffer(state: NegotiationState, userMessage: string): Promise<OpponentResponse> {
    const round = state.roundNumber + 1;
    const style = state.opponentStyle || 'Professional';
    const lastOffer = state.currentOffer;

    // Parse user numeric proposals if mentioned in userMessage
    const numbersInMsg = userMessage.match(/\d+([,.]\d+)?/g);
    let proposedSalary = lastOffer.salary;
    if (numbersInMsg && numbersInMsg.length > 0) {
      const parsed = parseFloat(numbersInMsg[0].replace(/,/g, ''));
      if (parsed > 1000) {
        proposedSalary = parsed;
      }
    }

    const target = state.targetValue;
    const batna = state.batnaValue;
    const minVal = state.minimumValue;

    // Heuristic opponent strategy calculation
    let opponentNextSalary = lastOffer.salary;
    let isAgreed = false;
    let isFailed = false;

    // Opponent ceiling calculation
    const opponentMaxBudget = target * 0.95; 

    if (proposedSalary <= opponentMaxBudget && round >= 2) {
      isAgreed = true;
      opponentNextSalary = proposedSalary;
      return {
        message: `After considering your proposal and strategic alignment, we accept your terms at ${opponentNextSalary.toLocaleString('en-IN')}/month with a 1-year contract and 30-day notice period! We look forward to finalizing the agreement.`,
        counterOffer: {
          salary: opponentNextSalary,
          duration: '1 Year',
          noticePeriod: '30 Days',
          paymentTerms: '30 Days',
        },
        isAgreed: true,
        isFailed: false,
      };
    }

    if (round >= 6 && proposedSalary > opponentMaxBudget * 1.1) {
      return {
        message: `Unfortunately, ${proposedSalary.toLocaleString('en-IN')} is beyond our absolute ceiling of ${opponentMaxBudget.toLocaleString('en-IN')}. We cannot reach agreement on these terms and may have to explore alternative options.`,
        isAgreed: false,
        isFailed: true,
      };
    }

    // Step counteroffer calculation
    const gap = proposedSalary - lastOffer.salary;
    const concessionStep = Math.min(gap * 0.45, 4000);
    opponentNextSalary = Math.round(lastOffer.salary + concessionStep);

    let stylePrefix = '';
    if (style === 'Friendly') {
      stylePrefix = `We really appreciate your enthusiasm! While ${proposedSalary.toLocaleString('en-IN')} is slightly above our allocated budget, `;
    } else if (style === 'Aggressive') {
      stylePrefix = `${proposedSalary.toLocaleString('en-IN')} is firm beyond our budget structure. `;
    } else if (style === 'Difficult') {
      stylePrefix = `That request is challenging for our finance committee. `;
    } else {
      stylePrefix = `We reviewed your counteroffer for ${proposedSalary.toLocaleString('en-IN')}. `;
    }

    return {
      message: `${stylePrefix}We can offer ₹${opponentNextSalary.toLocaleString('en-IN')} per month accompanied by a 1-year duration and 30-day notice period. How does this align with your priorities?`,
      counterOffer: {
        salary: opponentNextSalary,
        duration: '1 Year',
        noticePeriod: '30 Days',
        paymentTerms: '30 Days',
      },
      isAgreed: false,
      isFailed: false,
      concessionGiven: {
        description: `Increased monthly offer to ₹${opponentNextSalary.toLocaleString('en-IN')}`,
        valueGained: concessionStep,
      },
    };
  }

  async generateCoachAdvice(state: NegotiationState): Promise<CoachAdvice> {
    const currentSalary = state.currentOffer.salary;
    const target = state.targetValue;
    const batna = state.batnaValue;

    const gapToTarget = target - currentSalary;
    let power: 'HIGH' | 'BALANCED' | 'WEAK' = 'BALANCED';
    if (currentSalary >= batna) power = 'HIGH';
    if (currentSalary < batna - 5000) power = 'WEAK';

    return {
      positionScore: Math.min(95, Math.round((currentSalary / target) * 100)),
      opponentScore: 72,
      currentOfferText: `₹${currentSalary.toLocaleString('en-IN')}`,
      negotiationPower: power,
      recommendation: `Don't concede on salary alone. Trade salary concessions for a reduced notice period (30 days) or Net 15 payment terms.`,
      suggestedResponse: `"I can consider ₹${(currentSalary + Math.round(gapToTarget * 0.5)).toLocaleString('en-IN')} if we reduce the notice period to 30 days and set payment terms to Net 15."`,
      riskAlert: currentSalary < batna ? `⚠️ Current offer (₹${currentSalary.toLocaleString()}) is below your BATNA (₹${batna.toLocaleString()}). Do not sign without counteroffer!` : undefined,
      tacticalTip: `Always ask for a non-monetary trade-off whenever you make a price concession.`,
    };
  }

  async scoreNegotiation(state: NegotiationState): Promise<NegotiationScoreResult> {
    const rounds = state.roundNumber;
    const finalSalary = state.currentOffer.salary;
    const target = state.targetValue;
    const batna = state.batnaValue;

    const priceScore = Math.min(100, Math.round((finalSalary / target) * 100));
    const prepScore = state.batnaValue > 0 ? 90 : 65;
    const commScore = 88;
    const riskScore = 84;
    const concessionScore = rounds <= 4 ? 82 : 70;
    const strategyScore = Math.round((priceScore + prepScore + commScore) / 3);

    const overall = Math.round((priceScore + prepScore + commScore + riskScore + concessionScore + strategyScore) / 6);

    return {
      overallScore: overall,
      communicationScore: commScore,
      preparationScore: prepScore,
      priceScore: priceScore,
      riskScore: riskScore,
      concessionScore: concessionScore,
      strategyScore: strategyScore,
      strengths: [
        'Clear BATNA definition prior to starting negotiation',
        'Maintained firm position during initial counteroffers',
        'Effective use of non-monetary trade-offs',
      ],
      weaknesses: [
        'Conceded on price slightly faster than necessary in Round 2',
        'Could have requested performance-based bonus to bridge ZOPA gap',
      ],
      valueSaved: Math.max(0, finalSalary - state.minimumValue),
    };
  }

  async generateFinalContract(originalContent: string, agreedTerms: any): Promise<string> {
    return `
================================================================================
                         FINAL NEGOTIATED AGREEMENT
================================================================================

This Legally Binding Agreement is entered into on ${new Date().toLocaleDateString()} by and between the Undersigned Parties based upon the negotiated terms established in ContractIQ.

1. COMPENSATION & PAYMENT TERMS
   - Agreed Compensation: ₹${agreedTerms.salary ? agreedTerms.salary.toLocaleString('en-IN') : '70,000'} per month.
   - Payment Schedule: Remitted on a Net 30 basis. Late payments accrue 1.5% interest per month.

2. DURATION & NOTICE PERIOD
   - Agreement Duration: ${agreedTerms.duration || '1 Year'}.
   - Notice Period: Mutual 30 days written notice required by either party for termination without cause.

3. INTELLECTUAL PROPERTY & LIABILITY
   - Intellectual Property: IP assignment is strictly restricted to deliverables created directly under scope of work using Company assets.
   - Indemnification Cap: Aggregate liability of both parties is capped at total fees paid in preceding 12 months.

4. NON-COMPETE & RESTRICTIVE COVENANTS
   - Geographic Scope: 50 km radius.
   - Duration: 6 months post-termination.

--------------------------------------------------------------------------------
LEGAL DISCLAIMER: ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified attorney.
--------------------------------------------------------------------------------
    `.trim();
  }
}
