'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NegotiationSetupModal } from '@/components/negotiation/NegotiationSetupModal';
import { MessageSquare, PlusCircle, ArrowRight, Trophy, Target, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NegotiationHubPage() {
  const router = useRouter();
  const [showSetupModal, setShowSetupModal] = useState(false);

  const sampleNegotiations = [
    {
      id: '1',
      title: 'Salary & Terms Negotiation - Senior Engineer',
      opponent: 'HR Director (Professional)',
      status: 'AGREED',
      score: 88,
      target: '₹75,000 / mo',
      batna: '₹70,000 / mo',
      rounds: 3,
      date: '2 hours ago',
    },
    {
      id: '2',
      title: 'Enterprise SaaS Agreement Negotiation',
      opponent: 'Procurement Lead (Aggressive)',
      status: 'ACTIVE',
      score: 79,
      target: '₹5,00,000 / yr',
      batna: '₹4,50,000 / yr',
      rounds: 2,
      date: 'Yesterday',
    },
  ];

  const handleStartNew = (setupData: any) => {
    setShowSetupModal(false);
    router.push('/negotiation/1');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Negotiation Simulator Hub</h1>
          <p className="text-xs text-slate-400">Negotiate contracts against realistic AI opponents with live coaching</p>
        </div>

        <button
          onClick={() => setShowSetupModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Configure New Room</span>
        </button>
      </div>

      {/* Active & Completed Negotiations Grid */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base font-extrabold">Your Negotiation Rooms</CardTitle>
          <CardDescription>Select an active room or review completed scores and replays</CardDescription>
        </CardHeader>

        <div className="space-y-3">
          {sampleNegotiations.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/30 transition-all group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                  <span className="font-bold text-sm text-slate-100 group-hover:text-brand-400 transition-colors">
                    {n.title}
                  </span>
                  <Badge variant={n.status === 'AGREED' ? 'success' : 'info'}>{n.status}</Badge>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Opponent: {n.opponent} • Target: <strong className="text-emerald-400">{n.target}</strong> • BATNA: {n.batna} • {n.rounds} Rounds
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-white block">{n.score}/100</span>
                  <span className="text-[10px] text-slate-500">{n.date}</span>
                </div>
                <Link
                  href={n.status === 'AGREED' ? `/negotiation/${n.id}/report` : `/negotiation/${n.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md transition-all"
                >
                  <span>{n.status === 'AGREED' ? 'Review Report' : 'Enter Room'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Setup Modal */}
      <NegotiationSetupModal isOpen={showSetupModal} onStart={handleStartNew} />
    </div>
  );
}
