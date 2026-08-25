'use client';

import React, { useState } from 'react';
import { X, Users, PlusCircle, Trash2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface Party {
  name: string;
  email: string;
  company: string;
  role: string;
}

interface VariableValue {
  key: string;
  label: string;
  value: string;
}

interface CreateFromTemplateModalProps {
  template: any;
  userId: string;
  onClose: () => void;
  onCreated: (contractId: string) => void;
}

export function CreateFromTemplateModal({ template, userId, onClose, onCreated }: CreateFromTemplateModalProps) {
  const [contractName, setContractName] = useState(`${template.name} — `);
  const [parties, setParties] = useState<Party[]>([
    { name: '', email: '', company: '', role: 'Party 1' },
    { name: '', email: '', company: '', role: 'Party 2' },
  ]);
  const [varValues, setVarValues] = useState<VariableValue[]>(
    (template.variables || []).map((v: any) => ({ key: v.key, label: v.label, value: v.defaultVal || '' }))
  );
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'parties' | 'variables'>('parties');

  const addParty = () => {
    setParties((prev) => [...prev, { name: '', email: '', company: '', role: `Party ${prev.length + 1}` }]);
  };

  const removeParty = (idx: number) => {
    if (parties.length <= 2) return;
    setParties((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateParty = (idx: number, field: keyof Party, value: string) => {
    setParties((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleCreate = async () => {
    if (!contractName.trim()) { setError('Contract name is required.'); return; }
    if (parties.some((p) => !p.name.trim())) { setError('All parties must have a name.'); return; }

    setCreating(true);
    setError('');

    const variableValues: Record<string, string> = {};
    varValues.forEach((v) => { variableValues[v.key] = v.value; });

    try {
      const res = await fetch(`/api/contracts/from-template/${template.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, contractName, parties, variableValues }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create contract');
      }
      const data = await res.json();
      onCreated(data.contract.id);
    } catch (e: any) {
      setError(e.message || 'Failed to create contract');
      setCreating(false);
    }
  };

  const hasCustomVars = varValues.some((v) => !v.key.startsWith('PARTY_') && v.key !== 'CONTRACT_DATE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Create Contract from Template</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Template: <span className="text-brand-400 font-bold">{template.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Step Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setStep('parties')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${step === 'parties' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              1. Parties & Name
            </button>
            {hasCustomVars && (
              <button
                onClick={() => setStep('variables')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${step === 'variables' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                2. Fill Variables
              </button>
            )}
          </div>

          {step === 'parties' && (
            <div className="space-y-4">
              {/* Contract Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Contract Name *</label>
                <input
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="e.g. Standard NDA — Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Tip: Add the person/company name to distinguish it from other contracts</p>
              </div>

              {/* Parties */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-400" /> Parties ({parties.length})
                  </label>
                  <button
                    onClick={addParty}
                    className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Party
                  </button>
                </div>
                <div className="space-y-3">
                  {parties.map((party, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold text-accent-violet uppercase tracking-wider">
                          Party {idx + 1}
                        </span>
                        {parties.length > 2 && (
                          <button onClick={() => removeParty(idx)} className="text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Full Name *"
                          value={party.name}
                          onChange={(e) => updateParty(idx, 'name', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 col-span-2"
                        />
                        <input
                          placeholder="Email"
                          value={party.email}
                          onChange={(e) => updateParty(idx, 'email', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                        <input
                          placeholder="Company"
                          value={party.company}
                          onChange={(e) => updateParty(idx, 'company', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                        <input
                          placeholder="Role (e.g. Employer, Vendor)"
                          value={party.role}
                          onChange={(e) => updateParty(idx, 'role', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-replace notice */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
                Party information will automatically replace <code className="text-brand-400">{'{{PARTY_1_NAME}}'}</code>, <code className="text-brand-400">{'{{PARTY_1_COMPANY}}'}</code>, etc. in the template.
              </div>
            </div>
          )}

          {step === 'variables' && hasCustomVars && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Fill in additional template variables:</p>
              {varValues
                .filter((v) => !v.key.startsWith('PARTY_') && v.key !== 'CONTRACT_DATE')
                .map((v, i) => (
                  <div key={v.key}>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{v.label}</label>
                    <input
                      value={v.value}
                      onChange={(e) => {
                        const newVals = [...varValues];
                        newVals[varValues.findIndex((vv) => vv.key === v.key)].value = e.target.value;
                        setVarValues(newVals);
                      }}
                      placeholder={`{{${v.key}}}`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-all">
              Cancel
            </button>
            {hasCustomVars && step === 'parties' ? (
              <button
                onClick={() => setStep('variables')}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-all"
              >
                Next: Fill Variables →
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 text-white text-sm font-extrabold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Contract →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
