'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContractUploader } from '@/components/contracts/ContractUploader';
import { FileText, PlusCircle, UploadCloud, ArrowRight, Search, Loader2, Trash2, AlertCircle } from 'lucide-react';

export default function ContractsPage() {
  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/contracts?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to fetch contracts');
      const data = await res.json();
      setContracts(data.contracts || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading contracts');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete contract "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchContracts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Contract Repository</h1>
          <p className="text-xs text-slate-400">Manage, analyze, and negotiate your legal agreements stored in MongoDB</p>
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

      {/* Contract Uploader Section */}
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

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">No contracts found in database</p>
            <button
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
            >
              Upload Your First Contract
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((c) => (
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
                    <Badge variant={(c.riskScore || c.overallRisk) >= 70 ? 'danger' : (c.riskScore || c.overallRisk) >= 40 ? 'warning' : 'success'}>
                      Risk: {c.riskScore || c.overallRisk || 50}/100
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Type: {c.type} • {c.clausesCount ?? 0} Clauses Extracted • Updated {c.updatedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/workspace/${c.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                  >
                    Open Workspace
                  </Link>
                  <Link
                    href={`/negotiation?contractId=${c.id}`}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Negotiate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                    title="Delete Contract"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
