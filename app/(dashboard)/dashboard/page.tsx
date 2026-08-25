'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { SkillsRadarChart } from '@/components/analytics/SkillsRadarChart';
import { BadgeGrid } from '@/components/workshop/BadgeGrid';
import {
  FileText,
  MessageSquare,
  Trophy,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  PlusCircle,
  BookTemplate,
  Clock,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalTemplates: 4,
    activeContracts: 6,
    inReview: 2,
    inNegotiation: 3,
    completed: 5,
  });
  const [recentNegotiations, setRecentNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.recentNegotiations) setRecentNegotiations(data.recentNegotiations);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden glow-card">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome back, Alex Morgan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            AI Contract Negotiation & Template Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Manage reusable templates, generate independent multi-party contracts, and simulate stateful AI negotiations backed by MongoDB Atlas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/templates"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-extrabold transition-all"
          >
            <BookTemplate className="w-4 h-4 text-accent-violet" />
            <span>Template Library</span>
          </Link>
          <Link
            href="/contracts/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-extrabold shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Contract</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Templates" value={String(stats.totalTemplates ?? 4)} change="Reusable" icon={BookTemplate} iconColor="text-violet-400 bg-violet-500/10" />
        <StatCard title="Active Contracts" value={String(stats.activeContracts ?? 6)} change="+2 new" icon={FileText} iconColor="text-brand-400 bg-brand-500/10" />
        <StatCard title="In Review" value={String(stats.inReview ?? 2)} change="Pending" icon={Clock} iconColor="text-amber-400 bg-amber-500/10" />
        <StatCard title="In Negotiation" value={String(stats.inNegotiation ?? 3)} change="Active" icon={MessageSquare} iconColor="text-cyan-400 bg-cyan-500/10" />
        <StatCard title="Completed" value={String(stats.completed ?? 5)} change="Signed" icon={CheckCircle2} iconColor="text-emerald-400 bg-emerald-500/10" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Negotiations */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold">Recent AI Negotiations</CardTitle>
                  <CardDescription>History of stateful AI negotiations from MongoDB</CardDescription>
                </div>
                <Link href="/negotiation" className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>

            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
              </div>
            ) : recentNegotiations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active negotiations yet. Configure a room to start!
              </div>
            ) : (
              <div className="space-y-3">
                {recentNegotiations.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/30 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </span>
                        <Badge variant={item.status === 'AGREED' ? 'success' : 'info'}>{item.status}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Opponent: {item.opponent} • Value Gained: <strong className="text-emerald-400">{item.valueSaved}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white block">{item.score}/100</span>
                        <span className="text-[10px] text-slate-500">{item.date}</span>
                      </div>
                      <Link
                        href={item.status === 'AGREED' ? `/negotiation/${item.id}/report` : `/negotiation/${item.id}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-white text-xs font-bold transition-all"
                      >
                        {item.status === 'AGREED' ? 'View Report' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Badges Grid */}
          <BadgeGrid />
        </div>

        {/* Right Column (4 cols): Radar Chart & Workshop Widget */}
        <div className="lg:col-span-4 space-y-6">
          <SkillsRadarChart />

          {/* Workshop Quick Access Card */}
          <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-brand-400">
              <GraduationCap className="w-5 h-5" />
              <h4 className="font-extrabold text-sm text-white">Interactive Workshop</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Lesson 3: ZOPA (Zone of Possible Agreement) is ready. Complete the interactive scenario & quiz to earn +100 XP!
            </p>
            <Link
              href="/workshop/2"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Resume Workshop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
