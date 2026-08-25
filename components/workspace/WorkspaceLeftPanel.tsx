'use client';

import React, { useState } from 'react';
import { Users, FileText, History, ShieldAlert, ChevronDown, ChevronRight, PlusCircle, UserCheck } from 'lucide-react';
import { PartiesPanel } from '@/components/workspace/PartiesPanel';

interface WorkspaceLeftPanelProps {
  contract: any;
  userRole: string;
  userId: string;
  onContractUpdate: () => void;
}

export function WorkspaceLeftPanel({ contract, userRole, userId, onContractUpdate }: WorkspaceLeftPanelProps) {
  const [showPartiesModal, setShowPartiesModal] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(true);

  // Extract sections/clauses from contract content by headings/numbers
  const sections = (contract.content || '')
    .split(/\n(?=[0-9]+\.|\b[A-Z\s]{4,}\b)/)
    .map((block: string, i: number) => {
      const firstLine = block.trim().split('\n')[0] || `Section ${i + 1}`;
      return { id: i, title: firstLine.substring(0, 45) };
    })
    .filter((s: any) => s.title.trim().length > 0)
    .slice(0, 10);

  return (
    <div className="p-3 space-y-4 text-slate-300">
      {/* Risk Summary */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Risk Assessment</span>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
            contract.overallRisk >= 70 ? 'bg-rose-500/20 text-rose-400' :
            contract.overallRisk >= 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            Score: {contract.overallRisk}/100
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              contract.overallRisk >= 70 ? 'bg-rose-500' : contract.overallRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${contract.overallRisk}%` }}
          />
        </div>
      </div>

      {/* Parties */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-400" /> Parties ({contract.parties?.length || 0})
          </span>
          {['OWNER', 'EDITOR'].includes(userRole) && (
            <button
              onClick={() => setShowPartiesModal(true)}
              className="text-[10px] font-bold text-brand-400 hover:text-brand-300"
            >
              Manage
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {contract.parties?.length ? (
            contract.parties.map((p: any) => (
              <div key={p.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                <div className="font-bold text-white leading-tight">{p.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="text-brand-400">{p.role}</span>
                  {p.company && <span>• {p.company}</span>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-slate-500 italic">No parties listed yet.</p>
          )}
        </div>
      </div>

      {/* Sections / Outline */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <button
          onClick={() => setSectionsOpen(!sectionsOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-300"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent-violet" /> Contract Sections ({sections.length})
          </span>
          {sectionsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {sectionsOpen && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {sections.map((s: any) => (
              <div
                key={s.id}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200 truncate cursor-pointer transition-colors"
              >
                {s.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Permission Info */}
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Your Role: <strong className="text-white uppercase">{userRole}</strong></span>
      </div>

      {showPartiesModal && (
        <PartiesPanel
          contractId={contract.id}
          parties={contract.parties || []}
          userId={userId}
          onClose={() => setShowPartiesModal(false)}
          onUpdated={() => {
            setShowPartiesModal(false);
            onContractUpdate();
          }}
        />
      )}
    </div>
  );
}
