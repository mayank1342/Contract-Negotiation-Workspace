'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookTemplate,
  PlusCircle,
  UploadCloud,
  Search,
  Filter,
  FileText,
  Calendar,
  Copy,
  Trash2,
  Eye,
  Edit3,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TemplateUploadModal } from '@/components/templates/TemplateUploadModal';
import { CreateFromTemplateModal } from '@/components/templates/CreateFromTemplateModal';

const CONTRACT_TYPES = [
  'All Types',
  'NDA',
  'Employment Contract',
  'Service Agreement',
  'Freelance Contract',
  'Rental Agreement',
  'Partnership Agreement',
  'Vendor Agreement',
  'SaaS Agreement',
  'General',
];

const DEMO_USER_ID = 'demo-user-1';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [createFromTemplate, setCreateFromTemplate] = useState<any | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId: DEMO_USER_ID });
      if (searchQuery) params.set('search', searchQuery);
      if (selectedType !== 'All Types') params.set('type', selectedType);
      const res = await fetch(`/api/templates?${params}`);
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch {
      // seed demo templates if none
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedType]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This will NOT delete contracts created from it.`)) return;
    await fetch(`/api/templates/${id}?userId=${DEMO_USER_ID}`, { method: 'DELETE' });
    fetchTemplates();
  };

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/templates/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: DEMO_USER_ID }),
    });
    fetchTemplates();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-violet to-brand-500 flex items-center justify-center">
              <BookTemplate className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Template Library</h1>
          </div>
          <p className="text-xs text-slate-400 ml-10">
            Create once. Reuse for any party. Every generated contract is fully independent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <UploadCloud className="w-4 h-4 text-brand-400" />
            Upload Template
          </button>
          <Link
            href="/templates/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 hover:from-accent-violet/90 hover:to-brand-400 text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Template
          </Link>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-violet/10 to-brand-500/10 border border-brand-500/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white">One Template → Many Independent Contracts</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload or create a template with <code className="text-brand-400 bg-slate-900 px-1 py-0.5 rounded text-[10px]">{'{{VARIABLE}}'}</code> placeholders.
            Create contracts for Rahul, Amit, or any company — each gets its own independent copy & version history.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="space-y-0 p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search templates by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{selectedType === 'All Types' ? 'Filter' : selectedType}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-10 z-50 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1">
                {CONTRACT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSelectedType(t); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                      selectedType === t ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-violet/10 flex items-center justify-center">
              <BookTemplate className="w-8 h-8 text-accent-violet" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Templates Yet</h3>
              <p className="text-sm text-slate-400 mt-1">
                Upload a PDF/DOCX or create a template from scratch to get started.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-brand-400" /> Upload Template
              </button>
              <Link
                href="/templates/new"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 text-white text-xs font-bold transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Create Template
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onDelete={() => handleDelete(tpl.id, tpl.name)}
              onDuplicate={() => handleDuplicate(tpl.id)}
              onCreateContract={() => setCreateFromTemplate(tpl)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showUploadModal && (
        <TemplateUploadModal
          onClose={() => setShowUploadModal(false)}
          onSaved={() => { setShowUploadModal(false); fetchTemplates(); }}
          userId={DEMO_USER_ID}
        />
      )}
      {createFromTemplate && (
        <CreateFromTemplateModal
          template={createFromTemplate}
          userId={DEMO_USER_ID}
          onClose={() => setCreateFromTemplate(null)}
          onCreated={(contractId) => {
            setCreateFromTemplate(null);
            router.push(`/workspace/${contractId}`);
          }}
        />
      )}
    </div>
  );
}

function TemplateCard({ template, onDelete, onDuplicate, onCreateContract }: {
  template: any;
  onDelete: () => void;
  onDuplicate: () => void;
  onCreateContract: () => void;
}) {
  const contractCount = template._count?.contracts || 0;
  const vars = template.variables?.length || 0;

  return (
    <div className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-accent-violet/40 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-violet/20 to-brand-500/20 border border-accent-violet/20 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-accent-violet" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white leading-tight group-hover:text-accent-violet transition-colors line-clamp-1">
              {template.name}
            </h3>
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{template.type}</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
          {contractCount} contract{contractCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {template.description || 'No description.'}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(template.createdAt).toLocaleDateString()}
        </span>
        {vars > 0 && (
          <span className="flex items-center gap-1 text-amber-400/80">
            <Sparkles className="w-3 h-3" />
            {vars} variable{vars !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
        <button
          onClick={onCreateContract}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 hover:from-accent-violet/90 hover:to-brand-400 text-white text-xs font-extrabold shadow-md transition-all"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          Create Contract from This
        </button>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/templates/${template.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Link>
          <Link
            href={`/templates/${template.id}?edit=1`}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
          <button
            onClick={onDuplicate}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <Copy className="w-3.5 h-3.5" /> Dupe
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
