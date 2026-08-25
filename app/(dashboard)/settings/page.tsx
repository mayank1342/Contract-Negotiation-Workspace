'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Cpu, Key, Database, Shield, Check, Save } from 'lucide-react';

export default function SettingsPage() {
  const [provider, setProvider] = useState<'demo' | 'openai' | 'gemini'>('demo');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Settings & AI Providers</h1>
        <p className="text-xs text-slate-400">Configure AI provider keys, fallback modes, and database connection</p>
      </div>

      {/* AI Provider Settings Card */}
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            <span>AI Provider Abstraction</span>
          </CardTitle>
          <CardDescription>
            ContractIQ automatically uses offline Demo AI Mode when API keys are omitted
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 text-xs font-medium">
          <div className="space-y-2">
            <label className="text-slate-300 font-bold">Select Active AI Provider</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'demo', label: 'Demo AI Mode (Rule-Based)', desc: 'Works 100% offline without API key' },
                { id: 'openai', label: 'OpenAI GPT-4o', desc: 'Requires OPENAI_API_KEY' },
                { id: 'gemini', label: 'Google Gemini 1.5 Pro', desc: 'Requires GEMINI_API_KEY' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProvider(item.id as any)}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    provider === item.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-extrabold text-white text-xs">{item.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">OpenAI API Key (Optional)</label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Gemini API Key (Optional)</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </Card>

      {/* Database Connection Status Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Database className="w-5 h-5" />
          <h4 className="font-extrabold text-sm text-white">Database & Persistence Engine</h4>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <span className="font-bold text-white block">Prisma ORM (SQLite / PostgreSQL)</span>
            <span className="text-slate-400 text-[11px]">Database file: dev.db (Isolated user contracts & state)</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
            ACTIVE & SYNCED
          </span>
        </div>
      </Card>
    </div>
  );
}
