'use client';

import React from 'react';
import { ContractComparator } from '@/components/contracts/ContractComparator';

export default function ContractComparePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Contract Version Comparison</h1>
        <p className="text-xs text-slate-400">Side-by-side diff comparing Original Draft vs Negotiated Agreement</p>
      </div>

      <ContractComparator />
    </div>
  );
}
