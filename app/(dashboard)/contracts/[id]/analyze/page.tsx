'use client';

import React from 'react';
import Link from 'next/link';
import { RiskScoreCard } from '@/components/contracts/RiskScoreCard';
import { ClauseAnalyzer } from '@/components/contracts/ClauseAnalyzer';
import { WhatIfSimulator } from '@/components/contracts/WhatIfSimulator';
import { ArrowRight, MessageSquare, GitCompare, FileText } from 'lucide-react';

export default function ContractAnalyzePage({ params }: { params: { id: string } }) {
  const sampleClauses = [
    {
      title: 'Compensation & Extended Payment Cycle',
      text: 'Base salary shall be ₹60,000 per month. Payment shall be remitted on Net 60 days following monthly evaluation.',
      category: 'Financial',
      riskLevel: 'HIGH' as const,
      simpleExplanation: 'You get ₹60,000 per month, but payments are delayed by 2 months.',
      proExplanation: 'Base compensation is ₹60,000/mo, subject to a Net 60 disbursement lag tied to subjective monthly evaluation.',
      studentExplanation: 'Imagine working in January but receiving January salary in late March.',
      whyItMatters: 'Delayed payment affects personal cash flow and gives company leverage.',
      suggestedImprovement: 'Change to Net 15 or 1st day of month payroll.',
      negotiationStrategy: 'Request standard monthly payroll disbursement.',
    },
    {
      title: 'Asymmetric Termination Notice',
      text: 'Either party may terminate with 90 days notice. The Company reserves the right to terminate immediately for convenience with 1 week severance pay.',
      category: 'Termination',
      riskLevel: 'HIGH' as const,
      simpleExplanation: 'You must give 3 months notice to quit, but they can fire you with 1 week pay.',
      proExplanation: 'One-sided termination rights create a severe contractual imbalance.',
      studentExplanation: 'You are locked in for 90 days, but they can drop you in 7 days.',
      whyItMatters: 'Restricts job mobility while offering zero job security.',
      suggestedImprovement: 'Mutual 30-day notice period with 1 month severance pay.',
      negotiationStrategy: 'Frame mutual 30 days as standard industry practice.',
    },
    {
      title: 'Overbroad Intellectual Property Assignment',
      text: 'All inventions, software, code, and works created by the Individual during the term, whether during work hours or personal time, belong exclusively to the Company.',
      category: 'Intellectual Property',
      riskLevel: 'HIGH' as const,
      simpleExplanation: 'Anything you build, even projects on your own time on weekends, belongs to the company.',
      proExplanation: 'Overbroad IP scope includes pre-existing work and off-duty creation without carve-out exclusions.',
      studentExplanation: 'If you make a mobile app on your laptop at 2 AM on Sunday, the company owns it.',
      whyItMatters: 'Prevents personal side projects or open source contributions.',
      suggestedImprovement: 'Limit IP transfer strictly to work done directly for company using company equipment.',
      negotiationStrategy: 'Request explicit Schedule A listing of pre-existing personal inventions.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-400 font-bold uppercase">Contract Audit #1</span>
            <span className="text-xs text-slate-500">• Senior Software Engineer Employment Agreement</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Contract Risk Audit & Analysis</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/contracts/${params.id}/compare`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <GitCompare className="w-4 h-4 text-brand-400" />
            <span>Compare Versions</span>
          </Link>
          <Link
            href={`/negotiation?contractId=${params.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Launch Negotiation Room</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Risk Score Card Dial */}
      <RiskScoreCard
        overallRisk={78}
        financialRisk={82}
        terminationRisk={90}
        liabilityRisk={75}
        paymentRisk={68}
        ipRisk={72}
      />

      {/* Clause Analyzer List */}
      <ClauseAnalyzer clauses={sampleClauses} contractId={params.id} />

      {/* What-If Strategic Simulator */}
      <WhatIfSimulator />
    </div>
  );
}
