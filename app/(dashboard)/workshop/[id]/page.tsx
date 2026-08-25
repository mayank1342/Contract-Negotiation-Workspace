'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { InteractiveQuiz } from '@/components/workshop/InteractiveQuiz';
import { BookOpen, GraduationCap, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LessonDetailPage({ params }: { params: { id: string } }) {
  const [completed, setCompleted] = useState(false);

  const lessonData = {
    title: 'BATNA (Best Alternative to a Negotiated Agreement)',
    order: 2,
    summary: 'Master your walk-away point and calculate your negotiation leverage before stepping into any room.',
    theory: `
Your BATNA (Best Alternative to a Negotiated Agreement) is the absolute standard against which any proposed agreement should be measured. It is the course of action that will be taken by a party if no agreement can be reached.

Key Rules of BATNA:
1. Never accept a deal that is worse than your BATNA.
2. Formulate a strong BATNA before negotiating to gain strategic leverage.
3. Keep your BATNA dynamic—work to improve your alternative options continuously.
    `.trim(),
    example: `
Scenario: You are a freelance developer offered a contract paying ₹60,000/month.
However, you already have a confirmed standing offer from Client B paying ₹70,000/month for 20 hours/week.

Your BATNA is ₹70,000/month. If Client A refuses to match or exceed ₹70,000 (or offer better terms), you walk away and accept Client B.
    `.trim(),
    quiz: {
      question: 'When should you walk away from a contract negotiation?',
      options: [
        'Whenever the opponent disagrees with your initial counteroffer',
        'When the current offer is worse than your BATNA threshold',
        'After exactly 2 rounds of messaging',
        'Never walk away under any circumstances',
      ],
      correctAnswer: 1,
      explanation:
        'If a proposed contract is worse than your BATNA, you are financially and strategically better off taking your alternative option.',
    },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/workshop"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workshop Hub</span>
        </Link>
        <span className="text-xs font-mono font-bold text-amber-400">Lesson #{lessonData.order} • +100 XP</span>
      </div>

      {/* Theory Card */}
      <Card className="space-y-4">
        <CardHeader>
          <div className="flex items-center gap-2 text-brand-400">
            <GraduationCap className="w-6 h-6" />
            <span className="text-xs font-mono font-bold uppercase">Lesson Theory</span>
          </div>
          <CardTitle className="text-2xl font-black text-white">{lessonData.title}</CardTitle>
          <CardDescription>{lessonData.summary}</CardDescription>
        </CardHeader>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
          {lessonData.theory}
        </div>
      </Card>

      {/* Real World Example Card */}
      <Card className="space-y-3 bg-gradient-to-br from-slate-900 to-slate-950">
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Real-World Scenario Example</span>
          </CardTitle>
        </CardHeader>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
          {lessonData.example}
        </div>
      </Card>

      {/* Interactive Quiz */}
      <InteractiveQuiz
        question={lessonData.quiz.question}
        options={lessonData.quiz.options}
        correctAnswer={lessonData.quiz.correctAnswer}
        explanation={lessonData.quiz.explanation}
        onComplete={() => setCompleted(true)}
      />

      {/* Completion Banner */}
      {completed && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Lesson Completed! +100 XP Earned 🎉</h4>
              <p className="text-xs text-emerald-200">You've unlocked the BATNA Expert badge progress!</p>
            </div>
          </div>
          <Link
            href="/workshop/3"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all shrink-0"
          >
            Next Lesson: ZOPA →
          </Link>
        </div>
      )}
    </div>
  );
}
