'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Check, X, Loader2, ArrowRight } from 'lucide-react';

interface AIModifyPanelProps {
  contractId: string;
  userId: string;
  userRole: string;
  currentContent: string;
  onAISuggestionApply: (newContent: string, desc: string) => void;
}

const PRESET_COMMANDS = [
  'Change payment period from 30 days to 45 days',
  'Add a termination clause with 30 days notice',
  'Make this contract simpler and easier to understand',
  'Make clauses more favorable to the buyer',
  'Find risky liability and payment provisions',
  'Rewrite clauses in a professional legal tone',
];

export function AIModifyPanel({
  contractId,
  userId,
  userRole,
  currentContent,
  onAISuggestionApply,
}: AIModifyPanelProps) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [error, setError] = useState('');

  const canModify = ['OWNER', 'EDITOR'].includes(userRole);

  const handleGenerate = async (cmd?: string) => {
    const text = cmd || instruction;
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const res = await fetch(`/api/contracts/${contractId}/ai-modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          instruction: text,
          currentContent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate AI suggestion');
      }

      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (e: any) {
      setError(e.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!suggestion) return;
    onAISuggestionApply(suggestion.newText, `AI Modification: ${suggestion.instruction}`);
    setSuggestion(null);
    setInstruction('');
  };

  const handleReject = () => {
    setSuggestion(null);
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="flex items-center gap-2 text-white font-bold">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>AI Contract Assistant</span>
      </div>
      <p className="text-slate-400">
        Type an instruction or pick a shortcut below. AI suggestions will show a diff preview before being applied.
      </p>

      {/* Preset Command Shortcuts */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</span>
        <div className="flex flex-col gap-1.5">
          {PRESET_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              disabled={loading || !canModify}
              onClick={() => {
                setInstruction(cmd);
                handleGenerate(cmd);
              }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/30 hover:bg-slate-850 text-slate-300 hover:text-white transition-all disabled:opacity-50 flex items-center justify-between group"
            >
              <span className="line-clamp-1">{cmd}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-brand-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g. Change payment terms to Net 45..."
          rows={3}
          disabled={!canModify}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
        />
        <button
          onClick={() => handleGenerate()}
          disabled={loading || !instruction.trim() || !canModify}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 hover:from-accent-violet/90 hover:to-brand-400 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating Suggestion...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" /> Generate AI Suggestion
            </>
          )}
        </button>
        {!canModify && (
          <p className="text-[10px] text-amber-400/80 italic">
            You have {userRole} permission. Only Owners or Editors can request AI modifications.
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          {error}
        </div>
      )}

      {/* Suggestion Preview (Diff OLD vs NEW with Accept / Reject) */}
      {suggestion && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-brand-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Suggested Change
            </span>
          </div>
          <p className="text-slate-300 italic">"{suggestion.instruction}"</p>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase">OLD (Before)</span>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {suggestion.oldText}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">NEW (Suggested)</span>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] text-emerald-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {suggestion.newText}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleReject}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5 text-rose-400" /> Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-1 transition-all shadow-md"
            >
              <Check className="w-3.5 h-3.5" /> Accept & Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
