'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContractUploader } from '@/components/contracts/ContractUploader';
import { FileText, PlusCircle, UploadCloud, ShieldAlert, ArrowRight, Search, Filter } from 'lucide-react';

export default function ContractsPage() {
  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleContracts = [
    {
      id: '1',
      title: 'Senior Software Engineer Employment Agreement',
      type: 'Employment Contract',
      status: 'ANALYZED',
      riskScore: 78,
      clausesCount: 4,
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'SaaS Enterprise Service Agreement',
      type: 'Service Agreement',
      status: 'NEGOTIATING',
      riskScore: 62,
      clausesCount: 3,
      updatedAt: 'Yesterday',
    },
    {
      id: '3',
      title: 'Freelance UI/UX Design Contract',
      type: 'Freelance Contract',
      status: 'COMPLETED',
      riskScore: 35,
      clausesCount: 5,
      updatedAt: '3 days ago',
    },
    {
      id: '4',
      title: 'Commercial Office Rental Agreement',
      type: 'Rental Agreement',
      status: 'ANALYZED',
      riskScore: 70,
      clausesCount: 6,
      updatedAt: '1 week ago',
    },
  ];

  const filtered = sampleContracts.filter(
    (c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Contract Repository</h1>
          <p className="text-xs text-slate-400">Manage, analyze, and negotiate your legal agreements</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <UploadCloud className="w-4 h-4 text-brand-400" />
            <span>Upload Contract</span>
          </button>
          <Link
            href="/contracts/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-extrabold shadow-md shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Wizard</span>
          </Link>
        </div>
      </div>

      {/* Contract Uploader Section if Toggled */}
      {showUploader && (
        <div className="animate-in slide-in-from-top-4">
          <ContractUploader />
        </div>
      )}

      {/* Search & Contracts Grid */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter contracts by title or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/30 transition-all group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <span className="font-bold text-sm text-slate-100 group-hover:text-brand-400 transition-colors">
                    {c.title}
                  </span>
                  <Badge variant={c.riskScore >= 70 ? 'danger' : c.riskScore >= 40 ? 'warning' : 'success'}>
                    Risk: {c.riskScore}/100
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Type: {c.type} • {c.clausesCount} Clauses Extracted • Updated {c.updatedAt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/contracts/${c.id}/analyze`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                >
                  Audit Risks
                </Link>
                <Link
                  href={`/negotiation?contractId=${c.id}`}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1"
                >
                  <span>Negotiate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
