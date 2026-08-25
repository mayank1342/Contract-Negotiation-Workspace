'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Trophy, Handshake, ShieldAlert, Target, Award, Zap, Lock } from 'lucide-react';

interface BadgeItem {
  badgeKey: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

const allBadges: BadgeItem[] = [
  { badgeKey: 'first_deal', title: 'First Deal', description: 'Completed your first AI contract negotiation', icon: 'Handshake', isUnlocked: true },
  { badgeKey: 'risk_hunter', title: 'Risk Hunter', description: 'Identified 5 high-risk contract clauses', icon: 'ShieldAlert', isUnlocked: true },
  { badgeKey: 'batna_expert', title: 'BATNA Expert', description: 'Enforced your BATNA threshold in a negotiation', icon: 'Target', isUnlocked: true },
  { badgeKey: 'smart_negotiator', title: 'Smart Negotiator', description: 'Scored 85+ on an AI negotiation report', icon: 'Award', isUnlocked: false },
  { badgeKey: 'deadlock_breaker', title: 'Deadlock Breaker', description: 'Resolved a negotiation impasse using non-price trade-offs', icon: 'Zap', isUnlocked: false },
];

export function BadgeGrid() {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Negotiation Mastery Badges</span>
        </CardTitle>
        <CardDescription>Earn badges by completing negotiations, quizzes, and workshops</CardDescription>
      </CardHeader>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {allBadges.map((b) => {
          const Icon =
            b.icon === 'Handshake'
              ? Handshake
              : b.icon === 'ShieldAlert'
              ? ShieldAlert
              : b.icon === 'Target'
              ? Target
              : b.icon === 'Award'
              ? Award
              : Zap;

          return (
            <div
              key={b.badgeKey}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                b.isUnlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  b.isUnlocked ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {b.isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <h5 className="font-extrabold text-xs">{b.title}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{b.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
