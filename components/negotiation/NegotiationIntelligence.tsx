'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Cpu, ShieldCheck, Scale, Zap } from 'lucide-react';

interface IntelligenceProps {
  positionScore: number;
  opponentScore: number;
  power: 'HIGH' | 'BALANCED' | 'WEAK';
  concessionGivenCount: number;
  concessionReceivedCount: number;
  currentRisk: string;
}

export function NegotiationIntelligence({
  positionScore,
  opponentScore,
  power,
  concessionGivenCount,
  concessionReceivedCount,
  currentRisk,
}: IntelligenceProps) {
  return (
    <Card className="p-4 bg-slate-950 text-slate-100 border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Negotiation Intelligence</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          REAL-TIME LAYER
        </span>
      </div>

      {/* Position Score Comparison */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Position</span>
          <span className="text-xl font-extrabold text-brand-400">{positionScore}/100</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Opponent Position</span>
          <span className="text-xl font-extrabold text-amber-400">{opponentScore}/100</span>
        </div>
      </div>

      {/* Power & Concession Matrix */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-slate-400 font-medium">Negotiation Power:</span>
          <span className="font-extrabold text-emerald-400 uppercase tracking-wider">{power}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-slate-400 font-medium">Concession Ratio:</span>
          <span className="font-extrabold text-amber-400 font-mono">
            {concessionGivenCount} Gave : {concessionReceivedCount} Received
          </span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-slate-400 font-medium">Risk Level:</span>
          <span className="font-extrabold text-rose-400 uppercase">{currentRisk}</span>
        </div>
      </div>
    </Card>
  );
}
