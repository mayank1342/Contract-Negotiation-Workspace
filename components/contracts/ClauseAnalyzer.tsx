'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ClauseExplainerModal } from './ClauseExplainerModal';
import { FileText, Sparkles, Wand2, MessageSquare, Filter } from 'lucide-react';
import Link from 'next/link';

export interface ClauseItem {
  id?: string;
  title: string;
  text: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  simpleExplanation: string;
  proExplanation: string;
  studentExplanation: string;
  whyItMatters: string;
  suggestedImprovement: string;
  negotiationStrategy: string;
}

interface ClauseAnalyzerProps {
  clauses: ClauseItem[];
  contractId: string;
}

export function ClauseAnalyzer({ clauses, contractId }: ClauseAnalyzerProps) {
  const [selectedClause, setSelectedClause] = useState<ClauseItem | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredClauses = clauses.filter((c) => (riskFilter === 'ALL' ? true : c.riskLevel === riskFilter));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                <span>Extracted Contract Clauses</span>
              </CardTitle>
              <CardDescription>AI-extracted clauses analyzed for legal vulnerability and negotiation potential</CardDescription>
            </div>

            {/* Risk Level Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    riskFilter === lvl
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {filteredClauses.map((clause, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={clause.riskLevel === 'HIGH' ? 'danger' : clause.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                      {clause.riskLevel} RISK
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">{clause.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-500 transition-colors">
                    {clause.title}
                  </h4>
                </div>
              </div>

              {/* Clause Body Text */}
              <p className="text-xs font-mono bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                "{clause.text}"
              </p>

              {/* Simple Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                <strong className="text-slate-800 dark:text-slate-200">AI Summary:</strong> {clause.simpleExplanation}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={() => setSelectedClause(clause)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Clause</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClause(clause)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Rewrite</span>
                  </button>

                  <Link
                    href={`/negotiation?contractId=${contractId}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Negotiate This</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Explainer Modal */}
      <ClauseExplainerModal isOpen={!!selectedClause} onClose={() => setSelectedClause(null)} clause={selectedClause} />
    </>
  );
}
