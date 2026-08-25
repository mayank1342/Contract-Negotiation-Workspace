'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getRiskLabel } from '@/lib/utils';

interface RiskScoreCardProps {
  overallRisk: number;
  financialRisk: number;
  terminationRisk: number;
  liabilityRisk: number;
  paymentRisk: number;
  ipRisk: number;
}

export function RiskScoreCard({
  overallRisk,
  financialRisk,
  terminationRisk,
  liabilityRisk,
  paymentRisk,
  ipRisk,
}: RiskScoreCardProps) {
  const riskInfo = getRiskLabel(overallRisk);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Contract Risk Audit</span>
          </CardTitle>
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${riskInfo.color}`}>
            {riskInfo.label}
          </span>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Risk Score Gauge Dial */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Meter Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={overallRisk >= 70 ? 'text-rose-500' : overallRisk >= 40 ? 'text-amber-500' : 'text-emerald-500'}
                strokeDasharray={`${overallRisk}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{overallRisk}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Index</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">
            Calculated across 5 critical risk categories
          </p>
        </div>

        {/* Risk Breakdown Progress Bars */}
        <div className="md:col-span-7 space-y-3">
          <ProgressBar
            label="Financial Exposure Risk"
            value={financialRisk}
            showPercentage
            colorClass={financialRisk >= 70 ? 'bg-rose-500' : financialRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
          <ProgressBar
            label="Termination & Notice Risk"
            value={terminationRisk}
            showPercentage
            colorClass={terminationRisk >= 70 ? 'bg-rose-500' : terminationRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
          <ProgressBar
            label="Indemnification & Liability Risk"
            value={liabilityRisk}
            showPercentage
            colorClass={liabilityRisk >= 70 ? 'bg-rose-500' : liabilityRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
          <ProgressBar
            label="Payment Lag Risk"
            value={paymentRisk}
            showPercentage
            colorClass={paymentRisk >= 70 ? 'bg-rose-500' : paymentRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
          <ProgressBar
            label="Intellectual Property Carve-Out Risk"
            value={ipRisk}
            showPercentage
            colorClass={ipRisk >= 70 ? 'bg-rose-500' : ipRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
        </div>
      </div>
    </Card>
  );
}
