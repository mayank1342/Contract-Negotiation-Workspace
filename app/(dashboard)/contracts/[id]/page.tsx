'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, ShieldAlert, ArrowRight, GitCompare, Download, MessageSquare } from 'lucide-react';
import { ContractExporterService } from '@/lib/services/ContractExporterService';

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const sampleContent = `
EMPLOYMENT AGREEMENT

This Senior Software Engineer Employment Agreement ("Agreement") is made between TechGlobal Solutions Inc. ("Company") and Alex Morgan ("Employee").

1. POSITION & DUTIES
Employee shall serve as Senior Full Stack Engineer, performing duties assigned by Chief Technology Officer.

2. COMPENSATION
Base salary shall be ₹60,000 per month. Payment shall be remitted on Net 60 days following monthly evaluation.

3. DURATION & TERMINATION
This agreement is for a period of 2 years. Either party may terminate with 90 days notice. The Company reserves the right to terminate immediately for convenience with 1 week severance pay.

4. INTELLECTUAL PROPERTY
All code, inventions, and software produced during or outside work hours belong exclusively to the Company.

5. NON-COMPETE
Employee shall not engage in any competing software enterprise globally for 24 months post-termination.
  `.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="danger">HIGH RISK (78/100)</Badge>
            <span className="text-xs text-slate-500">• Employment Contract</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Senior Software Engineer Employment Agreement</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/contracts/${params.id}/analyze`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Audit Risks</span>
          </Link>
          <button
            onClick={() => ContractExporterService.exportToPDF('Senior Engineer Agreement', sampleContent)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-brand-400" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <span>Raw Contract Text</span>
          </CardTitle>
          <CardDescription>Inspected legal provisions pre-negotiation</CardDescription>
        </CardHeader>
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
          {sampleContent}
        </div>
      </Card>
    </div>
  );
}
