'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, X, ArrowRightLeft, FileCheck, IndianRupee, Clock, Calendar } from 'lucide-react';

interface OfferCardProps {
  roundNumber: number;
  offerBy: 'USER' | 'OPPONENT';
  salary: number;
  duration: string;
  noticePeriod: string;
  paymentTerms: string;
  status: string;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
}

export function OfferCard({
  roundNumber,
  offerBy,
  salary,
  duration,
  noticePeriod,
  paymentTerms,
  status,
  onAccept,
  onReject,
  onCounter,
}: OfferCardProps) {
  const isOpponent = offerBy === 'OPPONENT';

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isOpponent
        ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
        : 'bg-brand-950/40 text-slate-100 border-brand-500/30'
    }`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-black tracking-wider uppercase">
            OFFER #{roundNumber} ({offerBy})
          </span>
        </div>
        <Badge variant={status === 'ACCEPTED' ? 'success' : status === 'REJECTED' ? 'danger' : 'info'}>
          {status}
        </Badge>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Salary</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            ₹{salary.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
          <span className="text-sm font-bold text-slate-200">{duration}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Notice Period</span>
          <span className="text-sm font-bold text-slate-200">{noticePeriod}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Cycle</span>
          <span className="text-sm font-bold text-slate-200">{paymentTerms}</span>
        </div>
      </div>

      {/* Action Buttons for Opponent Offers */}
      {isOpponent && status === 'PENDING' && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800 mt-3">
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Accept Deal</span>
            </button>
          )}

          {onCounter && (
            <button
              onClick={onCounter}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Counteroffer</span>
            </button>
          )}

          {onReject && (
            <button
              onClick={onReject}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
