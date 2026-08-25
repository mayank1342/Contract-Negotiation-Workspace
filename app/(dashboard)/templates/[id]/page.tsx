'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Edit3, Sparkles, FileText, Trash2, Copy, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { CreateFromTemplateModal } from '@/components/templates/CreateFromTemplateModal';

const CONTRACT_TYPES = [
  'NDA', 'Employment Contract', 'Service Agreement', 'Freelance Contract',
  'Rental Agreement', 'Partnership Agreement', 'Vendor Agreement', 'SaaS Agreement', 'General',
];

const DEMO_USER_ID = 'demo-user-1';

export default function TemplateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditInit = searchParams.get('edit') === '1';

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isEditInit);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const fetchTemplate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/templates/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setTemplate(data.template);
      setName(data.template.name);
      setType(data.template.type);
      setDescription(data.template.description);
      setContent(data.template.content);
    } catch {
      router.push('/templates');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, name, type, description, content }),
      });
      if (res.ok) {
        setIsEditing(false);
        fetchTemplate();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    const res = await fetch(`/api/templates/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: DEMO_USER_ID }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/templates/${data.template.id}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    await fetch(`/api/templates/${id}?userId=${DEMO_USER_ID}`, { method: 'DELETE' });
    router.push('/templates');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{template.type}</span>
            <h1 className="text-xl font-black text-white">{template.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-400" /> Edit
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-accent-violet" /> Duplicate
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 hover:from-accent-violet/90 hover:to-brand-400 text-white text-xs font-extrabold shadow-lg transition-all"
              >
                <ArrowRight className="w-4 h-4" /> Create Contract
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {isEditing ? (
            <Card className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Template Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contract Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    {CONTRACT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Template Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-violet" />
                  <span>Template Document</span>
                </CardTitle>
                <CardDescription>{template.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {template.content}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Overview</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Contracts Created</span>
                <span className="font-bold text-white">{template._count?.contracts || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Created Date</span>
                <span className="font-bold text-white">{new Date(template.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Last Modified</span>
                <span className="font-bold text-white">{new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Placeholders ({template.variables?.length || 0})
              </CardTitle>
            </CardHeader>
            <div className="space-y-1.5">
              {template.variables?.length ? (
                template.variables.map((v: any) => (
                  <div key={v.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">{v.label}</span>
                    <code className="text-[10px] text-brand-400 font-mono font-bold">{`{{${v.key}}}`}</code>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No dynamic variables detected in this template.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showCreateModal && (
        <CreateFromTemplateModal
          template={template}
          userId={DEMO_USER_ID}
          onClose={() => setShowCreateModal(false)}
          onCreated={(contractId) => router.push(`/workspace/${contractId}`)}
        />
      )}
    </div>
  );
}
