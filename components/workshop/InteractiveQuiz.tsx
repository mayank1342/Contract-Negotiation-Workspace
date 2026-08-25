'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onComplete?: () => void;
}

export function InteractiveQuiz({ question, options, correctAnswer, explanation, onComplete }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);

    if (idx === correctAnswer) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      if (onComplete) onComplete();
    }
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="w-5 h-5 text-brand-500" />
          <span>Interactive Lesson Quiz</span>
        </CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>

      <div className="space-y-2.5">
        {options.map((opt, idx) => {
          let btnClass = 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500/50';
          if (submitted) {
            if (idx === correctAnswer) {
              btnClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
            } else if (idx === selected) {
              btnClass = 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSubmit(idx)}
              disabled={submitted}
              className={`w-full p-4 rounded-2xl border text-left font-medium text-xs transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {submitted && idx === correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {submitted && idx === selected && idx !== correctAnswer && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1">
          <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quiz Explanation
          </span>
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
    </Card>
  );
}
