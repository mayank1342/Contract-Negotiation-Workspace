'use client';

import React from 'react';
import { ContractWizard } from '@/components/contracts/ContractWizard';

export default function NewContractPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">AI Contract Creator Wizard</h1>
        <p className="text-xs text-slate-400">Step-by-step AI drafting tailored to your terms and risk preferences</p>
      </div>

      <ContractWizard />
    </div>
  );
}
