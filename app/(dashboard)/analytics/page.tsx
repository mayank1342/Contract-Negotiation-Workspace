'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { SkillsRadarChart } from '@/components/analytics/SkillsRadarChart';
import { NegotiationScoreTrend } from '@/components/analytics/NegotiationScoreTrend';
import { BarChart3, TrendingUp, IndianRupee, ShieldCheck, Award, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const [filterPeriod, setFilterPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Negotiation Performance Analytics</h1>
          <p className="text-xs text-slate-400">Track value saved, score trends, and risk mitigation efficiency</p>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['7d', '30d', '90d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterPeriod === p
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Est. Value Saved" value="₹45,000" change="+18%" icon={IndianRupee} iconColor="text-emerald-400 bg-emerald-500/10" />
        <StatCard title="Average Score" value="88 / 100" change="+4 points" icon={Trophy} iconColor="text-amber-400 bg-amber-500/10" />
        <StatCard title="Risk Reduction Index" value="-42%" change="High -> Low" icon={ShieldCheck} iconColor="text-brand-400 bg-brand-500/10" />
        <StatCard title="Negotiation Success" value="85%" change="+5%" icon={Award} iconColor="text-cyan-400 bg-cyan-500/10" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <NegotiationScoreTrend />
        </div>
        <div className="lg:col-span-5">
          <SkillsRadarChart />
        </div>
      </div>
    </div>
  );
}

