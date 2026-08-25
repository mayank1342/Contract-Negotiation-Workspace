'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BadgeGrid } from '@/components/workshop/BadgeGrid';
import { GraduationCap, BookOpen, CheckCircle2, Play, Sparkles, ArrowRight, Zap, Target } from 'lucide-react';

const lessons = [
  { id: '1', order: 1, title: 'Negotiation Basics & Mindset', category: 'Foundations', isCompleted: true, xp: 50 },
  { id: '2', order: 2, title: 'BATNA (Best Alternative to Negotiated Agreement)', category: 'Strategy', isCompleted: true, xp: 100 },
  { id: '3', order: 3, title: 'ZOPA (Zone of Possible Agreement)', category: 'Strategy', isCompleted: false, xp: 100 },
  { id: '4', order: 4, title: 'Anchoring & Counteroffers', category: 'Tactics', isCompleted: false, xp: 100 },
  { id: '5', order: 5, title: 'Concession Management & Trading', category: 'Tactics', isCompleted: false, xp: 100 },
  { id: '6', order: 6, title: 'Contract Risk Detection & Audit', category: 'Risk', isCompleted: false, xp: 100 },
  { id: '7', order: 7, title: 'Handling Difficult Negotiators', category: 'Psychology', isCompleted: false, xp: 100 },
  { id: '8', order: 8, title: 'Deadlock Resolution & Impasse', category: 'Advanced', isCompleted: false, xp: 100 },
  { id: '9', order: 9, title: 'Closing a Deal & Finalizing Agreements', category: 'Closing', isCompleted: false, xp: 100 },
  { id: '10', order: 10, title: 'Post-Negotiation Review & Learning', category: 'Mastery', isCompleted: false, xp: 100 },
];

export default function WorkshopHubPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden glow-card">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Mastery Course • 10 Interactive Lessons</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">AI Contract Negotiation Workshop</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Master the art and science of legal negotiation with interactive theory, scenarios, and quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-white block">Level 3 Negotiator</span>
            <span className="text-slate-400 font-mono text-[10px]">450 / 600 XP</span>
          </div>
        </div>
      </div>

      {/* Badges Overview */}
      <BadgeGrid />

      {/* 10 Workshop Lessons Grid */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <span>10-Lesson Mastery Curriculum</span>
          </CardTitle>
          <CardDescription>Complete each lesson and interactive quiz to earn XP and unlock badges</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((les) => (
            <div
              key={les.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                les.isCompleted
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                  : 'bg-slate-900 border-slate-800 text-white hover:border-brand-500/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-400">Lesson #{les.order}</span>
                  <Badge variant={les.isCompleted ? 'success' : 'info'}>
                    {les.isCompleted ? 'COMPLETED' : `+${les.xp} XP`}
                  </Badge>
                </div>
                <h4 className="font-extrabold text-sm text-slate-100">{les.title}</h4>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">{les.category}</span>
                <Link
                  href={`/workshop/${les.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
                >
                  <span>{les.isCompleted ? 'Review' : 'Start Lesson'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
