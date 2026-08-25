'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const CONTRACT_TYPES = [
  'NDA', 'Employment Contract', 'Service Agreement', 'Freelance Contract',
  'Rental Agreement', 'Partnership Agreement', 'Vendor Agreement', 'SaaS Agreement', 'General',
];

const COMMON_VARIABLES = [
  { key: 'PARTY_1_NAME', label: 'Party 1 Name' },
  { key: 'PARTY_1_COMPANY', label: 'Party 1 Company' },
  { key: 'PARTY_2_NAME', label: 'Party 2 Name' },
  { key: 'PARTY_2_COMPANY', label: 'Party 2 Company' },
  { key: 'CONTRACT_DATE', label: 'Contract Date' },
  { key: 'PAYMENT_AMOUNT', label: 'Payment Amount' },
  { key: 'TERMINATION_PERIOD', label: 'Termination Period' },
  { key: 'NOTICE_PERIOD', label: 'Notice Period' },
];

const DEMO_USER_ID = 'demo-user-1';

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('General');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-detect variables from content
  const detectedVars = Array.from(new Set(
    Array.from(content.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map((m) => m[1])
  ));


  const insertVariable = (key: string) => {
    setContent((prev) => prev + `{{${key}}}`);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('Template name is required.'); return; }
    if (!content.trim()) { setError('Template content is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, name, type, description, content }),
      });
      if (!res.ok) throw new Error('Failed to save');
      router.push('/templates');
    } catch {
      setError('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Template Library
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-violet to-brand-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Create New Template</h1>
          <p className="text-xs text-slate-400">Use {'{{VARIABLE_NAME}}'} syntax for dynamic placeholders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Template Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Standard NDA Template"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Contract Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    {CONTRACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Description</label>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>Write the contract text. Use {'{{VARIABLE}}'} placeholders for dynamic fields.</CardDescription>
            </CardHeader>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder={`NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of {{CONTRACT_DATE}}, between:

Party 1: {{PARTY_1_NAME}} of {{PARTY_1_COMPANY}}
Party 2: {{PARTY_2_NAME}} of {{PARTY_2_COMPANY}}

1. CONFIDENTIAL INFORMATION
...`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
            {detectedVars.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <p className="text-xs font-bold text-brand-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                  Detected Variables ({detectedVars.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedVars.map((v) => (
                    <span key={v} className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-mono font-bold border border-brand-500/30">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <Link href="/templates" className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all">
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 text-white text-sm font-extrabold shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        {/* Sidebar: Variable Helper */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variable Cheatsheet</CardTitle>
              <CardDescription>Click to insert into your template</CardDescription>
            </CardHeader>
            <div className="space-y-1.5">
              {COMMON_VARIABLES.map((v) => (
                <button
                  key={v.key}
                  onClick={() => insertVariable(v.key)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/30 transition-all group"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white">{v.label}</span>
                  <code className="text-[10px] text-brand-400 font-mono">{`{{${v.key}}}`}</code>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <p>Write template with <code className="text-brand-400">{'{{VARIABLE}}'}</code> placeholders</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <p>Click "Create Contract" from the library</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <p>Fill in party details — placeholders auto-replaced</p>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                <p>Each contract is independent — editing one never affects others</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
