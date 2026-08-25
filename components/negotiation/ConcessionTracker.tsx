'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';

interface ConcessionItem {
  madeBy: 'USER' | 'OPPONENT';
  description: string;
  valueGained: number;
  valueGiven: number;
  roundNumber: number;
}

export function ConcessionTracker({ concessions }: { concessions: ConcessionItem[] }) {
  const userGaveCount = concessions.filter((c) => c.madeBy === 'USER').length;
  const oppGaveCount = concessions.filter((c) => c.madeBy === 'OPPONENT').length;

  const isUnbalanced = userGaveCount > oppGaveCount + 1;

  return (
    <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Concession Log</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          {concessions.length} Logged
        </span>
      </div>

      {/* Unbalanced Concession Warning */}
      {isUnbalanced && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>⚠️ You are giving concessions without receiving equivalent value. Trade concessions instead of giving them away!</span>
        </div>
      )}

      {/* List of Concessions */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {concessions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-2">No concessions logged yet.</p>
        ) : (
          concessions.map((c, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                c.madeBy === 'USER'
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              }`}
            >
              {c.madeBy === 'USER' ? (
                <ArrowDownRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Round #{c.roundNumber} ({c.madeBy})</span>
                </div>
                <p className="font-medium text-[11px] leading-tight mt-0.5">{c.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
