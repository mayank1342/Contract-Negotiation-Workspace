'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FileText, ArrowRight, ArrowLeft, Check, Sparkles, Wand2, Download, MessageSquare } from 'lucide-react';
import { ContractExporterService } from '@/lib/services/ContractExporterService';

const contractTypes = [
  'Employment Contract',
  'Freelance Agreement',
  'NDA (Non-Disclosure Agreement)',
  'Service Agreement',
  'Vendor Agreement',
  'Software Development Agreement',
  'Commercial Rental Agreement',
];

export function ContractWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'Employment Contract',
    partyA: 'TechGlobal Solutions Inc.',
    partyARole: 'Employer',
    partyB: 'Alex Morgan',
    partyBRole: 'Employee',
    salary: '70000',
    paymentTerms: 'Net 30',
    duration: '1 Year',
    noticePeriod: '30 Days',
    terminationRule: 'Mutual 30-day notice period with 1 month severance',
    specialReqs: 'Carve out pre-existing personal open source projects from IP assignment.',
  });

  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDraft(`
================================================================================
                        ${formData.type.toUpperCase()}
================================================================================

This ${formData.type} is made and entered into on ${new Date().toLocaleDateString()} by and between:

PARTIES:
1. ${formData.partyA} ("${formData.partyARole}")
2. ${formData.partyB} ("${formData.partyBRole}")

1. FINANCIAL TERMS
   The ${formData.partyARole} agrees to pay ${formData.partyB} compensation in the amount of ₹${parseInt(formData.salary || '0').toLocaleString('en-IN')} per month. All invoices or payroll disbursements shall be remitted on a ${formData.paymentTerms} schedule.

2. DURATION & NOTICE PERIOD
   This agreement shall remain in effect for a term of ${formData.duration}. Either party may terminate this agreement by providing a ${formData.noticePeriod} prior written notice.

3. TERMINATION & REMEDIES
   ${formData.terminationRule}

4. SPECIAL PROVISIONS & IP CARVE-OUTS
   ${formData.specialReqs} All inventions created prior to commencement of work remain the exclusive property of ${formData.partyB}.

--------------------------------------------------------------------------------
LEGAL DISCLAIMER: ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.
--------------------------------------------------------------------------------
      `.trim());
      setIsGenerating(false);
      setStep(7);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Step {step} of 7 — {step === 7 ? 'AI Draft Review' : 'Contract Setup'}
          </span>
          <span className="text-xs font-bold text-slate-500">{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <ProgressBar value={step} max={7} colorClass="bg-gradient-to-r from-brand-600 to-accent-violet" />
      </Card>

      {/* Step Content Panels */}
      <Card>
        {step === 1 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 1: Select Contract Type</CardTitle>
              <CardDescription>Choose the type of legal agreement you want ContractIQ AI to draft.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contractTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                    formData.type === t
                      ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{t}</span>
                  {formData.type === t && <Check className="w-4 h-4 text-brand-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 2: Parties & Roles</CardTitle>
              <CardDescription>Identify the contracting parties and their roles.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Party A (First Party)</label>
                <input
                  type="text"
                  value={formData.partyA}
                  onChange={(e) => setFormData({ ...formData, partyA: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Party B (Second Party)</label>
                <input
                  type="text"
                  value={formData.partyB}
                  onChange={(e) => setFormData({ ...formData, partyB: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 3: Financial Terms</CardTitle>
              <CardDescription>Set compensation amount and payment cycle terms.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Monthly Compensation (₹)</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                >
                  <option value="Net 15">Net 15 Days (Recommended)</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 4: Duration & Notice Period</CardTitle>
              <CardDescription>Specify contract term length and notice requirements.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contract Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notice Period</label>
                <select
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
                >
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days (Standard)</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 5: Termination Provisions</CardTitle>
              <CardDescription>Define termination terms and severance rules.</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Termination Rules</label>
              <textarea
                rows={3}
                value={formData.terminationRule}
                onChange={(e) => setFormData({ ...formData, terminationRule: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Step 6: Special Requirements & Exclusions</CardTitle>
              <CardDescription>Add custom IP exclusions, non-compete terms, or special clauses.</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Special Requirements</label>
              <textarea
                rows={4}
                value={formData.specialReqs}
                onChange={(e) => setFormData({ ...formData, specialReqs: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <span>AI-Generated Contract Draft</span>
                </CardTitle>
                <button
                  onClick={() => ContractExporterService.exportToPDF(formData.type, generatedDraft)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </CardHeader>
            <textarea
              rows={12}
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none"
            />
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {step < 6 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 6 && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white text-xs font-extrabold shadow-lg shadow-brand-500/30 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGenerating ? 'Drafting Contract...' : 'Generate AI Draft'}</span>
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
