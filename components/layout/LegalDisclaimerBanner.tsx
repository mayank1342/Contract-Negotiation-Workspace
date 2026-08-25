import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function LegalDisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
        <span>
          <strong>Legal Disclaimer:</strong> ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 text-slate-300 py-3 px-4 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>ContractIQ Legal Disclaimer:</strong> ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">VERIFIED EDUCATIONAL PLATFORM</span>
      </div>
    </div>
  );
}
