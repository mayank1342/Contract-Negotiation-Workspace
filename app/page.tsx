'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  Zap,
  GraduationCap,
  Scale,
  Play,
  Bot,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { LegalDisclaimerBanner } from '@/components/layout/LegalDisclaimerBanner';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-white tracking-tight">
              Contract<span className="text-brand-400">IQ</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Negotiation Workshop</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-brand-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
          <a href="#workshop" className="hover:text-brand-400 transition-colors">Workshop</a>
          <a href="#faq" className="hover:text-brand-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
          >
            Start Negotiating
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto w-full text-center space-y-8 overflow-hidden hero-glow">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Don't just sign contracts. Understand, negotiate, and improve them.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Negotiate Smarter. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-violet">
            Sign Better.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-medium leading-relaxed">
          AI-powered contract analysis, realistic negotiation simulation, risk detection, BATNA/ZOPA calculation, and live coaching in one SaaS platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet text-white text-base font-extrabold shadow-xl shadow-brand-500/30 hover:scale-105 transition-all"
          >
            <span>Start Negotiating Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contracts"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-base font-bold transition-all"
          >
            <FileText className="w-5 h-5 text-brand-400" />
            <span>Analyze a Contract</span>
          </Link>
        </div>

        {/* Live Animated Negotiation Preview */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-left space-y-4 glow-card">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">ContractIQ AI Simulator — Round 2</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                BATNA & ZOPA Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 text-xs text-slate-200 border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">AI Opponent (HR Director):</span>
                  "We can offer ₹60,000 per month with a 2-year commitment and 90-day notice period."
                </div>
                <div className="p-3.5 rounded-2xl bg-brand-600 text-xs text-white shadow-md">
                  <span className="text-[10px] font-bold text-brand-200 uppercase block mb-1">You:</span>
                  "I am targeting ₹75,000 per month with a mutual 30-day notice period."
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 text-xs text-slate-200 border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">AI Opponent (HR Director):</span>
                  "₹75,000 is outside our current budget tier. I can offer ₹68,000 for a 1-year commitment."
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-brand-400">
                  <Bot className="w-4 h-4" />
                  <span>AI Negotiation Coach</span>
                </div>
                <div className="text-xs space-y-2 text-slate-300 font-medium">
                  <p className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                    💡 <strong>Recommendation:</strong> Don't increase salary again. Ask for a shorter notice period (30 days) instead.
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                    ZOPA Overlap: ₹68,000 — ₹75,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">How ContractIQ Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">From raw legal text to negotiated agreement in 4 streamlined steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Upload or Draft', desc: 'Create a contract with our 7-step wizard or upload existing PDF/DOCX files.', icon: FileText },
            { step: '02', title: 'AI Risk Audit', desc: 'Instant clause extraction and risk score across financial, termination, and liability terms.', icon: Shield },
            { step: '03', title: 'Simulate & Negotiate', desc: 'Negotiate against realistic AI opponents with live BATNA/ZOPA calculation.', icon: MessageSquare },
            { step: '04', title: 'Score & Export', desc: 'Receive round-by-round replay, 5-dimension scoring, and export final negotiated PDF.', icon: TrendingUp },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3 relative glow-card">
                <span className="text-3xl font-black text-brand-500 font-mono">{item.step}</span>
                <Icon className="w-6 h-6 text-slate-300" />
                <h3 className="font-extrabold text-white text-lg">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Enterprise AI Negotiation Capabilities</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Built for freelancers, employees, legal teams, and business leaders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Target className="w-8 h-8 text-brand-400" />
            <h3 className="font-bold text-xl text-white">BATNA & ZOPA Engines</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate your walk-away threshold (BATNA) and visualize agreement overlaps (ZOPA) in real-time.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Brain className="w-8 h-8 text-accent-violet" />
            <h3 className="font-bold text-xl text-white">Stateful AI Opponent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI remembers previous offers, counter-offers, user priorities, and personality styles without blindly accepting proposals.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-xl text-white">Interactive Workshop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              10 interactive lessons covering anchoring, concession management, deadlock resolution, and quizzes with XP badges.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-brand-400" />
            <span className="font-extrabold text-white">ContractIQ © 2026</span>
          </div>
          <p className="text-xs text-slate-500">Don't just sign contracts. Understand, negotiate, and improve them.</p>
        </div>
        <LegalDisclaimerBanner />
      </footer>
    </div>
  );
}
