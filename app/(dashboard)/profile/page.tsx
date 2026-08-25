'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Mail, Shield, Zap, Briefcase, Target } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">User Profile & Negotiation Style</h1>
        <p className="text-xs text-slate-400">Manage your persona, roles, preferences, and negotiation benchmarks</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
            AM
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Alex Morgan</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">Freelancer</Badge>
              <span className="text-xs text-slate-400 font-mono">Level 3 Negotiator (450 XP)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Email Address</span>
            <span className="text-slate-200 font-mono">demo@contractiq.com</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Contract Experience</span>
            <span className="text-slate-200">Intermediate (3-5 Years)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Preferred Negotiation Style</span>
            <span className="text-brand-400 font-bold">Professional (Assertive & Balanced)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Primary Goal</span>
            <span className="text-slate-200">Maximize salary compensation & eliminate unfair termination lock-in</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
