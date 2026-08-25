'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { PlayCircle, HelpCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoundItem {
  round: number;
  userMsg: string;
  oppMsg: string;
  userOffer: number;
  oppOffer: number;
  insight: string;
}

export function NegotiationReplay({ rounds }: { rounds: RoundItem[] }) {
  const [selectedRound, setSelectedRound] = useState<RoundItem>(rounds[0] || {
    round: 1,
    userMsg: 'Targeting ₹78,000/mo with 30-day notice',
    oppMsg: 'Offered ₹60,000/mo with 2-year term',
    userOffer: 78000,
    oppOffer: 60000,
    insight: 'Good initial anchor, establishing high aspiration value.',
  });

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-brand-500" />
          <span>Interactive Negotiation Replay & Review</span>
        </CardTitle>
        <CardDescription>Replay every round to analyze strategic decisions and mistakes</CardDescription>
      </CardHeader>

      {/* Round Selector Timeline */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {rounds.map((r) => (
          <button
            key={r.round}
            onClick={() => setSelectedRound(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedRound.round === r.round
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>Round #{r.round}</span>
          </button>
        ))}
      </div>

      {/* Round Breakdown Detail Card */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-extrabold font-mono text-brand-400">
            ROUND #{selectedRound.round} ANALYSIS
          </span>
          <span className="text-xs font-mono text-slate-400">
            User Offer: ₹{selectedRound.userOffer.toLocaleString()} | Opponent Offer: ₹{selectedRound.oppOffer.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-brand-400 uppercase">Your Action</span>
            <p className="font-medium text-slate-200">{selectedRound.userMsg}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Opponent Response</span>
            <p className="font-medium text-slate-200">{selectedRound.oppMsg}</p>
          </div>
        </div>

        {/* AI Insight / What Could I Have Done Better */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950 to-slate-950 border border-brand-500/30 space-y-1.5">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            What could I have done better in Round #{selectedRound.round}?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedRound.insight}</p>
        </div>
      </div>
    </Card>
  );
}
