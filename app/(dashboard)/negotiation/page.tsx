'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NegotiationSetupModal } from '@/components/negotiation/NegotiationSetupModal';
import { MessageSquare, PlusCircle, ArrowRight, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NegotiationHubPage() {
  const router = useRouter();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNegotiations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/negotiations');
      if (!res.ok) throw new Error('Failed to fetch negotiations');
      const data = await res.json();
      setNegotiations(data.negotiations || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading negotiations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNegotiations();
  }, [fetchNegotiations]);

  const handleStartNew = async (setupData: any) => {
    setShowSetupModal(false);
    try {
      const res = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: setupData.title || 'New AI Negotiation Room',
          opponentRole: setupData.opponentRole || 'HR Manager',
          opponentStyle: setupData.opponentStyle || 'Professional',
          userRole: setupData.userRole || 'Candidate',
          targetValue: setupData.targetValue || 75000,
          minimumValue: setupData.minimumValue || 65000,
          batnaValue: setupData.batnaValue || 68000,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/negotiation/${data.negotiation.id}`);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete negotiation room "${title}"?`)) return;
    try {
      const res = await fetch(`/api/negotiations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNegotiations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Negotiation Simulator Hub</h1>
          <p className="text-xs text-slate-400">Negotiate contracts against realistic AI opponents backed by MongoDB</p>
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

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : negotiations.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">No active negotiation rooms found in database</p>
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
            >
              Configure First Negotiation Room
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {negotiations.map((n) => (
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
                  <button
                    onClick={() => handleDelete(n.id, n.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                    title="Delete Room"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Setup Modal */}
      <NegotiationSetupModal isOpen={showSetupModal} onStart={handleStartNew} />
    </div>
  );
}
