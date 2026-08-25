'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';
import { LegalDisclaimerBanner } from '@/components/layout/LegalDisclaimerBanner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@contractiq.com');
  const [password, setPassword] = useState('password123');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <Link href="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Shield className="w-6 h-6" />
            </Link>
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back to ContractIQ</h2>
            <p className="text-xs text-slate-400">Sign in to your AI Contract Negotiation Hub</p>
          </div>

          {/* Quick Demo Auto-Fill Button */}
          <button
            type="button"
            onClick={() => {
              setEmail('demo@contractiq.com');
              setPassword('password123');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Auto-fill Demo Account (Student / Freelancer)</span>
          </button>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{error}</p>}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-bold">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-brand-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white font-extrabold text-xs shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-400 font-bold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
      <LegalDisclaimerBanner />
    </div>
  );
}
