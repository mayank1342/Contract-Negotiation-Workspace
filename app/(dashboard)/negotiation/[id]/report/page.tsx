'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { NegotiationReplay } from '@/components/negotiation/NegotiationReplay';
import { Trophy, Award, CheckCircle2, AlertCircle, Download, FileCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ContractExporterService } from '@/lib/services/ContractExporterService';

export default function NegotiationReportPage({ params }: { params: { id: string } }) {
  const finalTerms = {
    salary: 72000,
    duration: '1 Year',
    noticePeriod: '30 Days',
    paymentTerms: 'Net 15',
  };

  const finalContractText = `
================================================================================
                         FINAL NEGOTIATED AGREEMENT
================================================================================

This Legally Binding Agreement is entered into on ${new Date().toLocaleDateString()} by and between TechGlobal Solutions Inc. ("Employer") and Alex Morgan ("Employee").

1. COMPENSATION & PAYMENT TERMS
   - Agreed Compensation: ₹72,000 per month.
   - Payment Schedule: Remitted on a Net 15 basis without performance holds.

2. DURATION & NOTICE PERIOD
   - Agreement Duration: 1 Year commitment.
   - Notice Period: Mutual 30 days written notice required by either party for termination.

3. INTELLECTUAL PROPERTY & LIABILITY
   - Intellectual Property: IP assignment is strictly restricted to deliverables created directly under scope of work using Company assets.
   - Indemnification Cap: Aggregate liability of both parties is capped at total fees paid in preceding 12 months.

--------------------------------------------------------------------------------
LEGAL DISCLAIMER: ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.
--------------------------------------------------------------------------------
  `.trim();

  const sampleRounds = [
    {
      round: 1,
      userMsg: 'Targeting ₹78,000/mo with 30-day notice',
      oppMsg: 'Offered ₹60,000/mo with 2-year commitment and 90-day notice',
      userOffer: 78000,
      oppOffer: 60000,
      insight: 'Good initial anchor, establishing high aspiration value.',
    },
    {
      round: 2,
      userMsg: 'Proposed ₹72,000 with mutual 30-day notice and Net 15',
      oppMsg: 'Countered with ₹68,000/mo for 1-year commitment',
      userOffer: 72000,
      oppOffer: 68000,
      insight: 'Excellent conditional concession! Linked salary drop to notice reduction.',
    },
    {
      round: 3,
      userMsg: 'Agreed to ₹72,000/mo with Net 15 payment terms',
      oppMsg: 'Accepted final negotiated proposal',
      userOffer: 72000,
      oppOffer: 72000,
      insight: 'Successfully closed above BATNA (₹70,000) and within ZOPA!',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">AGREEMENT REACHED 🎉</Badge>
            <span className="text-xs text-slate-400">• Senior Software Engineer Employment Agreement</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Negotiation Scorecard & Replay</h1>
        </div>

        <button
          onClick={() => ContractExporterService.exportToPDF('Final Senior Engineer Agreement', finalContractText)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Final Contract PDF</span>
        </button>
      </div>

      {/* Top Overall Score Card Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-4xl font-black text-white font-mono">88 / 100</span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">EXCELLENT DEAL</span>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">Estimated Value Gained: +₹12,000 / mo</span>
          </div>

          {/* 6 Category Dimension Scores */}
          <div className="md:col-span-8 space-y-3">
            <ProgressBar label="Communication & Assertiveness" value={92} showPercentage colorClass="bg-brand-500" />
            <ProgressBar label="Preparation & BATNA Benchmark" value={90} showPercentage colorClass="bg-emerald-500" />
            <ProgressBar label="Price & Value Negotiation" value={85} showPercentage colorClass="bg-amber-500" />
            <ProgressBar label="Risk & Legal Protection" value={88} showPercentage colorClass="bg-violet-500" />
            <ProgressBar label="Concession Management" value={82} showPercentage colorClass="bg-cyan-500" />
            <ProgressBar label="Strategic Decision Making" value={91} showPercentage colorClass="bg-brand-400" />
          </div>
        </div>
      </Card>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle className="text-base font-extrabold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              ✓ Maintained clear BATNA benchmark throughout all 3 rounds of negotiation.
            </li>
            <li className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              ✓ Successfully traded salary concession directly for notice period reduction (90d → 30d).
            </li>
            <li className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              ✓ Polished, professional communication style that built rapport without surrendering leverage.
            </li>
          </ul>
        </Card>

        <Card className="space-y-3">
          <CardHeader>
            <CardTitle className="text-base font-extrabold text-amber-500 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              ⚠️ Opened with a steep anchor (₹78,000) that pushed opponent near max budget tier.
            </li>
            <li className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              ⚠️ Could have requested an annual performance bonus clause to bridge ZOPA gap further.
            </li>
          </ul>
        </Card>
      </div>

      {/* Round-by-Round Replay */}
      <NegotiationReplay rounds={sampleRounds} />

      {/* Final Contract Preview Box */}
      <Card className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              <span>Final Negotiated Agreement</span>
            </CardTitle>
            <button
              onClick={() => ContractExporterService.exportToPDF('Final Senior Engineer Agreement', finalContractText)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </CardHeader>
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          {finalContractText}
        </div>
      </Card>
    </div>
  );
}
