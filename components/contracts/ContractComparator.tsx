'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GitCompare, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface ClauseDiff {
  title: string;
  originalText: string;
  negotiatedText: string;
  status: 'IMPROVED' | 'CHANGED' | 'WORSE';
  riskDelta: string;
}

const sampleDiffs: ClauseDiff[] = [
  {
    title: 'Compensation & Payment Schedule',
    originalText: '₹60,000 / month payable on Net 60 days following evaluation.',
    negotiatedText: '₹72,000 / month payable on Net 15 days without holds.',
    status: 'IMPROVED',
    riskDelta: '-35 Risk Points (High -> Low)',
  },
  {
    title: 'Termination & Notice Period',
    originalText: 'Employer may terminate immediately with 1 week pay. Employee requires 90 days notice.',
    negotiatedText: 'Mutual 30-day written notice period for both parties with 1 month severance.',
    status: 'IMPROVED',
    riskDelta: '-40 Risk Points (High -> Low)',
  },
  {
    title: 'Intellectual Property Ownership',
    originalText: 'All inventions produced during or outside work hours belong exclusively to Company.',
    negotiatedText: 'IP assignment restricted to work produced directly under scope of work using Company assets.',
    status: 'IMPROVED',
    riskDelta: '-25 Risk Points (High -> Low)',
  },
];

export function ContractComparator() {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-brand-500" />
          <span>Contract Version Comparison</span>
        </CardTitle>
        <CardDescription>Side-by-side clause diff comparison showing risk improvements from negotiation</CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {sampleDiffs.map((diff, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{diff.title}</h4>
              <Badge variant={diff.status === 'IMPROVED' ? 'success' : diff.status === 'WORSE' ? 'danger' : 'warning'}>
                {diff.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-slate-700 dark:text-slate-300">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">Original Draft:</span>
                "{diff.originalText}"
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-slate-700 dark:text-slate-300">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">Negotiated Agreement:</span>
                "{diff.negotiatedText}"
              </div>
            </div>

            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{diff.riskDelta}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
