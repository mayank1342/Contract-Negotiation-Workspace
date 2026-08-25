'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { HelpCircle, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const presetScenarios = [
  { label: 'Ask for 15% higher salary', query: 'salary_plus_15' },
  { label: 'Request notice period reduction (90d → 30d)', query: 'notice_30d' },
  { label: 'Demand Net 15 payment terms', query: 'net_15' },
  { label: 'Remove 2-year Non-Compete', query: 'no_noncompete' },
];

export function WhatIfSimulator() {
  const [selectedScenario, setSelectedScenario] = useState(presetScenarios[0].query);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState({
    expectedResponse: 'The opponent will likely counter at +8% salary rather than agreeing to +15% directly.',
    acceptanceProbability: 72,
    riskImpact: 'LOW',
    potentialBenefit: '₹9,000 / month additional income',
    recommendedAction: 'Combine this request with a willingness to sign a 1-year commitment.',
  });

  const runSimulation = (queryKey: string) => {
    setSelectedScenario(queryKey);
    setIsSimulating(true);

    setTimeout(() => {
      if (queryKey === 'notice_30d') {
        setResult({
          expectedResponse: 'Opponent will accept 30-day notice if salary demand is kept within approved budget tier.',
          acceptanceProbability: 88,
          riskImpact: 'VERY LOW',
          potentialBenefit: 'Reduces career lock-in by 60 days',
          recommendedAction: 'Frame mutual 30 days as standard industry practice.',
        });
      } else if (queryKey === 'net_15') {
        setResult({
          expectedResponse: 'Finance team will agree to Net 30, but Net 15 requires executive approval.',
          acceptanceProbability: 64,
          riskImpact: 'LOW',
          potentialBenefit: 'Improves cash flow cycle by 45 days',
          recommendedAction: 'Ask for Net 15 with Net 30 as acceptable fallback.',
        });
      } else if (queryKey === 'no_noncompete') {
        setResult({
          expectedResponse: 'Opponent will resist removing non-compete entirely, but will agree to narrow geographic scope.',
          acceptanceProbability: 55,
          riskImpact: 'MEDIUM',
          potentialBenefit: 'Protects post-employment job freedom',
          recommendedAction: 'Offer non-solicitation of clients instead of total non-compete.',
        });
      } else {
        setResult({
          expectedResponse: 'The opponent will likely counter at +8% salary rather than agreeing to +15% directly.',
          acceptanceProbability: 72,
          riskImpact: 'LOW',
          potentialBenefit: '₹9,000 / month additional income',
          recommendedAction: 'Combine this request with a willingness to sign a 1-year commitment.',
        });
      }
      setIsSimulating(false);
    }, 600);
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent-violet" />
          <span>"What-If" Negotiation Simulator</span>
        </CardTitle>
        <CardDescription>Simulate strategic options before presenting counteroffers to the opponent</CardDescription>
      </CardHeader>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presetScenarios.map((sc) => (
          <button
            key={sc.query}
            onClick={() => runSimulation(sc.query)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedScenario === sc.query
                ? 'bg-accent-violet text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Simulation Result Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-accent-violet flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI SIMULATION FORECAST
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {result.acceptanceProbability}% Success Probability
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase">Expected Opponent Reaction</h4>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">{result.expectedResponse}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Potential Benefit</span>
            <p className="text-xs font-bold text-emerald-400">{result.potentialBenefit}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Action</span>
            <p className="text-xs text-slate-300">{result.recommendedAction}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
