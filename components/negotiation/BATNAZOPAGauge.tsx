'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Target, Shield, Zap, AlertTriangle } from 'lucide-react';
import { BATNAService } from '@/lib/services/BATNAService';
import { ZOPAService } from '@/lib/services/ZOPAService';

interface GaugeProps {
  currentOffer: number;
  target: number;
  minimum: number;
  batna: number;
  zopaMin: number;
  zopaMax: number;
}

export function BATNAZOPAGauge({ currentOffer, target, minimum, batna, zopaMin, zopaMax }: GaugeProps) {
  const batnaEval = BATNAService.evaluateBATNA(currentOffer, batna);
  const zopaEval = ZOPAService.calculateZOPA(minimum, zopaMax);

  const formatK = (val: number) => `₹${Math.round(val / 1000)}k`;

  return (
    <div className="space-y-4">
      {/* BATNA Indicator Card */}
      <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">BATNA Threshold</span>
          </div>
          <span className="text-xs font-extrabold font-mono text-brand-400">{formatK(batna)} / mo</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Current Offer:</span>
          <span className={currentOffer >= batna ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
            {formatK(currentOffer)} / mo
          </span>
        </div>

        <div className={`p-2.5 rounded-xl border text-[11px] font-bold ${batnaEval.statusColor}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>{batnaEval.statusLabel}</span>
          </div>
          <p className="text-[10px] font-normal leading-relaxed opacity-90">{batnaEval.recommendation}</p>
        </div>
      </Card>

      {/* ZOPA Overlap Card */}
      <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ZOPA (Agreement Zone)</span>
          </div>
          <span className="text-xs font-extrabold font-mono text-amber-400">{zopaEval.suggestedTargetRange}</span>
        </div>

        {/* Visual ZOPA Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Your Min: {formatK(minimum)}</span>
            <span>Opponent Max: {formatK(zopaMax)}</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full relative overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-amber-400 to-emerald-400"
              style={{ width: '85%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Target: {formatK(target)}</span>
            <span className="text-emerald-400 font-bold">Overlap: {formatK(zopaEval.overlapAmount)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
