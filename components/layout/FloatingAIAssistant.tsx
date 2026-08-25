'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight } from 'lucide-react';
import { getAIProvider } from '@/lib/ai';

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am ContractIQ Assistant. Ask me anything about your contracts, BATNA calculation, ZOPA ranges, or counteroffer strategies!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Explain BATNA & ZOPA',
    'How do I negotiate a higher salary?',
    'What are risky termination clauses?',
    'Give me a counteroffer template',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    if (!textToSend) setQuery('');
    setLoading(true);

    setTimeout(() => {
      let answer = '';
      const lower = prompt.toLowerCase();
      if (lower.includes('batna') || lower.includes('zopa')) {
        answer =
          '**BATNA** (Best Alternative to a Negotiated Agreement) is your fallback walk-away option. **ZOPA** (Zone of Possible Agreement) is the financial overlap between your minimum threshold and the opponent’s maximum budget.';
      } else if (lower.includes('salary') || lower.includes('higher')) {
        answer =
          'To negotiate a higher salary: 1) Anchor high with market benchmarks. 2) Link concessions to non-monetary trades (e.g. "I can accept ₹70,000 if notice period is 30 days"). 3) Never accept the first counteroffer immediately!';
      } else if (lower.includes('termination') || lower.includes('risky')) {
        answer =
          'Watch out for asymmetric termination clauses (e.g. company can fire with 1 week notice, but you require 90 days). Always negotiate mutual 30-day notice periods with severance.';
      } else {
        answer =
          `Here is an AI strategy recommendation for "${prompt}": Always establish your BATNA before opening negotiations, anchor near the upper boundary of ZOPA, and trade concessions conditionally instead of giving them away!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white p-3.5 px-5 rounded-full shadow-2xl shadow-brand-500/40 font-semibold text-sm transition-all hover:scale-105 active:scale-95 group border border-white/20"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Assistant</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">ContractIQ AI Assistant</h4>
                <p className="text-[10px] text-white/80">Real-time Legal & Strategy Guide</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-brand-500/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking strategy...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              type="text"
              placeholder="Ask AI Assistant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
