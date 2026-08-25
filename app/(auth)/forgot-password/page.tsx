'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Mail } from 'lucide-react';
import { LegalDisclaimerBanner } from '@/components/layout/LegalDisclaimerBanner';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <Link href="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Shield className="w-6 h-6" />
            </Link>
            <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-400">Enter your email to receive password reset instructions</p>
          </div>

          {!sent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4 text-xs font-medium"
            >
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="demo@contractiq.com"
                    className="w-full pl-9 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/30 transition-all"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center space-y-2">
              <p>Password reset instructions have been sent to your email address!</p>
              <Link href="/login" className="inline-block font-bold text-white underline">
                Return to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      <LegalDisclaimerBanner />
    </div>
  );
}
