'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Target, Users, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onStart: (setupData: any) => void;
}

export function NegotiationSetupModal({ isOpen, onStart }: SetupModalProps) {
  const [formData, setFormData] = useState({
    opponentRole: 'HR Director',
    opponentStyle: 'Professional',
    targetValue: 75000,
    minimumValue: 65000,
    batnaValue: 68000,
    mustHaves: 'Mutual 30-day notice period & Net 30 payment cycle',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white leading-tight">Configure AI Negotiation Simulator</h3>
            <p className="text-xs text-slate-400">Establish your targets, BATNA threshold, and opponent personality</p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-medium">
          {/* Opponent Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Opponent Role</label>
              <input
                type="text"
                value={formData.opponentRole}
                onChange={(e) => setFormData({ ...formData, opponentRole: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Opponent Personality</label>
              <select
                value={formData.opponentStyle}
                onChange={(e) => setFormData({ ...formData, opponentStyle: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              >
                <option value="Friendly">Friendly & Collaborative</option>
                <option value="Professional">Professional (Balanced)</option>
                <option value="Aggressive">Aggressive & Firm</option>
                <option value="Difficult">Difficult & Skeptical</option>
              </select>
            </div>
          </div>

          {/* Financial Benchmarks */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Target Value (₹)</label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Minimum (₹)</label>
              <input
                type="number"
                value={formData.minimumValue}
                onChange={(e) => setFormData({ ...formData, minimumValue: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">BATNA Fallback (₹)</label>
              <input
                type="number"
                value={formData.batnaValue}
                onChange={(e) => setFormData({ ...formData, batnaValue: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Must Haves */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Must-Have Non-Monetary Terms</label>
            <input
              type="text"
              value={formData.mustHaves}
              onChange={(e) => setFormData({ ...formData, mustHaves: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => onStart(formData)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Negotiation Room</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
