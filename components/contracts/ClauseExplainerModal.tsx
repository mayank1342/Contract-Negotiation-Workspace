'use client';

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ClauseExplainerProps {
  isOpen: boolean;
  onClose: () => void;
  clause: {
    title: string;
    text: string;
    riskLevel: string;
    simpleExplanation: string;
    proExplanation: string;
    studentExplanation: string;
    whyItMatters: string;
    suggestedImprovement: string;
    negotiationStrategy: string;
  } | null;
}

export function ClauseExplainerModal({ isOpen, onClose, clause }: ClauseExplainerProps) {
  const [activeTab, setActiveTab] = useState<'simple' | 'pro' | 'student'>('simple');

  if (!isOpen || !clause) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant={clause.riskLevel === 'HIGH' ? 'danger' : clause.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                {clause.riskLevel} RISK
              </Badge>
              <span className="text-xs font-mono text-slate-400 uppercase">Clause Explainer</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{clause.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Clause Text */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Original Legal Text:</span>
            "{clause.text}"
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('simple')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'simple'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple Mode</span>
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pro'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Professional</span>
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student-Friendly</span>
            </button>
          </div>

          {/* Active Explanation Panel */}
          <div className="p-5 rounded-2xl bg-brand-500/5 border border-brand-500/20 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeTab === 'simple' && clause.simpleExplanation}
            {activeTab === 'pro' && clause.proExplanation}
            {activeTab === 'student' && clause.studentExplanation}
          </div>

          {/* Strategic Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Why It Matters</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">{clause.whyItMatters}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Suggested Improvement</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">{clause.suggestedImprovement}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
