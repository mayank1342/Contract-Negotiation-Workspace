'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, Bot, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CoachAdvice } from '@/lib/ai/types';

interface CoachPanelProps {
  advice: CoachAdvice;
  onUseSuggestion: (suggestionText: string) => void;
}

export function AICoachPanel({ advice, onUseSuggestion }: CoachPanelProps) {
  return (
    <Card className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">AI NEGOTIATION COACH</h4>
            <p className="text-[10px] text-slate-400">Real-Time Tactical Guidance</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500/20 text-brand-400 border border-brand-500/30">
          LIVE COACH
        </span>
      </div>

      {/* Risk Alert Warning if Present */}
      {advice.riskAlert && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{advice.riskAlert}</span>
        </div>
      )}

      {/* Strategic Recommendation */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Strategic Recommendation</span>
        <p className="text-xs font-medium text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {advice.recommendation}
        </p>
      </div>

      {/* Suggested Response */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">Suggested Response</span>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-brand-200 leading-relaxed">
          {advice.suggestedResponse}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onUseSuggestion(advice.suggestedResponse.replace(/^"|"$/g, ''))}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Suggestion</span>
          </button>
        </div>
      </div>

      {/* Tactical Tip */}
      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{advice.tacticalTip}</span>
      </div>
    </Card>
  );
}
