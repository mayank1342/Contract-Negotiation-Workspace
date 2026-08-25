'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import { LegalDisclaimerBanner } from '@/components/layout/LegalDisclaimerBanner';

const roles = [
  'Student',
  'Freelancer',
  'Employee',
  'Employer',
  'Client',
  'Vendor',
  'Startup',
  'Small Business',
  'Company Representative',
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'password123',
    role: 'Freelancer',
    experience: 'Intermediate',
    preferredStyle: 'Professional',
    mainGoal: 'Maximize contract value & reduce termination risk',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create account.');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <Link href="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Shield className="w-6 h-6" />
            </Link>
            <h2 className="text-2xl font-black text-white tracking-tight">Create Your ContractIQ Account</h2>
            <p className="text-xs text-slate-400">Join the AI Contract Negotiation Workshop</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs font-medium">
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            {/* Role Onboarding Selection */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span>Select Your Role</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-semibold"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Preferred Style</label>
                <select
                  value={formData.preferredStyle}
                  onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="Collaborative">Collaborative</option>
                  <option value="Professional">Professional</option>
                  <option value="Assertive">Assertive</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white font-extrabold text-xs shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Complete Onboarding & Start'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <LegalDisclaimerBanner />
    </div>
  );
}
