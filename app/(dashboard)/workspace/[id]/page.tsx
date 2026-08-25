'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Edit3,
  Sparkles,
  Share2,
  MessageSquare,
  History,
  FileDown,
  Users,
  Activity,
  Loader2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { WorkspaceLeftPanel } from '@/components/workspace/WorkspaceLeftPanel';
import { WorkspaceCenterEditor } from '@/components/workspace/WorkspaceCenterEditor';
import { WorkspaceRightPanel } from '@/components/workspace/WorkspaceRightPanel';
import { ShareModal } from '@/components/workspace/ShareModal';
import { ContractExporterService } from '@/lib/services/ContractExporterService';

const DEMO_USER_ID = 'demo-user-1';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [contract, setContract] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('OWNER');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [rightTab, setRightTab] = useState<'ai' | 'comments' | 'activity'>('ai');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [versionSaveDesc, setVersionSaveDesc] = useState('');

  const fetchContract = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/workspace?userId=${DEMO_USER_ID}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setContract(data.contract);
      setUserRole(data.userRole);
      setEditedContent(data.contract.content);
    } catch {
      router.push('/contracts');
    } finally {
      setLoading(false);
    }
  }, [contractId, router]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const canEdit = ['OWNER', 'EDITOR'].includes(userRole);

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    try {
      // Save content
      await fetch(`/api/contracts/${contractId}/workspace`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, content: editedContent }),
      });
      // Create version snapshot
      await fetch(`/api/contracts/${contractId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          changeDescription: versionSaveDesc || 'Manual save',
          newContent: editedContent,
        }),
      });
      setContract((prev: any) => ({ ...prev, content: editedContent }));
      setEditMode(false);
      setSaveSuccess(true);
      setVersionSaveDesc('');
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchContract();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    ContractExporterService.exportToPDF(
      contract?.title || 'Contract',
      contract?.content || ''
    );
  };

  const handleExportDOCX = () => {
    ContractExporterService.exportToDOCX(
      contract?.title || 'Contract',
      contract?.content || ''
    );
  };


  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="-m-4 lg:-m-8 flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0 gap-3">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/contracts" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-bold text-sm text-white truncate leading-tight">{contract.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400">{contract.type}</span>
              {contract.template && (
                <span className="text-[10px] text-accent-violet/70">
                  from: {contract.template.name}
                </span>
              )}
              <StatusBadge status={contract.status} />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {canEdit && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-brand-400" /> Edit
            </button>
          )}

          {editMode && (
            <>
              <input
                type="text"
                placeholder="Describe change (for version history)..."
                value={versionSaveDesc}
                onChange={(e) => setVersionSaveDesc(e.target.value)}
                className="hidden lg:block bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-52"
              />
              <button
                onClick={() => { setEditMode(false); setEditedContent(contract.content); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium"
              >
                <X className="w-3.5 h-3.5" /> Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </>
          )}

          <button
            onClick={() => { setRightTab('ai'); setRightCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${rightTab === 'ai' && !rightCollapsed ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI
          </button>

          <button
            onClick={() => { setRightTab('comments'); setRightCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${rightTab === 'comments' && !rightCollapsed ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </button>

          <button
            onClick={() => { setRightTab('activity'); setRightCollapsed(false); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${rightTab === 'activity' && !rightCollapsed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            <Activity className="w-3.5 h-3.5" /> Activity
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-400" /> Share
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-400" /> Export PDF
          </button>

          <button
            onClick={handleExportDOCX}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-brand-400" /> Export DOCX
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className={`shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col transition-all duration-200 ${leftCollapsed ? 'w-10' : 'w-72'}`}>
          <div className="flex items-center justify-between p-2 border-b border-slate-800">
            {!leftCollapsed && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Contract Info</span>}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="ml-auto w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            >
              {leftCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>
          {!leftCollapsed && (
            <div className="flex-1 overflow-y-auto">
              <WorkspaceLeftPanel
                contract={contract}
                userRole={userRole}
                userId={DEMO_USER_ID}
                onContractUpdate={fetchContract}
              />
            </div>
          )}
        </div>

        {/* CENTER: Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <WorkspaceCenterEditor
            contract={contract}
            editMode={editMode}
            editedContent={editedContent}
            onContentChange={setEditedContent}
            canEdit={canEdit}
            userId={DEMO_USER_ID}
            onAISuggestionApply={(newContent, desc) => {
              setEditedContent(newContent);
              setVersionSaveDesc(desc);
              setEditMode(true);
            }}
          />
        </div>

        {/* RIGHT PANEL */}
        {!rightCollapsed && (
          <div className="shrink-0 w-80 border-l border-slate-800 bg-slate-900/50 flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                {rightTab === 'ai' ? 'AI Assistant' : rightTab === 'comments' ? 'Comments' : 'Activity'}
              </span>
              <button
                onClick={() => setRightCollapsed(true)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <WorkspaceRightPanel
                contractId={contractId}
                userId={DEMO_USER_ID}
                userRole={userRole}
                activeTab={rightTab}
                contract={contract}
                currentContent={editedContent}
                onAISuggestionApply={(newContent, desc) => {
                  setEditedContent(newContent);
                  setVersionSaveDesc(desc);
                  setEditMode(true);
                }}
                onVersionRestore={(content) => {
                  setEditedContent(content);
                  setEditMode(true);
                  fetchContract();
                }}
              />
            </div>
          </div>
        )}
      </div>

      {showShare && (
        <ShareModal
          contractId={contractId}
          userId={DEMO_USER_ID}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: 'bg-slate-700 text-slate-300',
    IN_REVIEW: 'bg-amber-500/20 text-amber-400',
    NEGOTIATING: 'bg-brand-500/20 text-brand-400',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${map[status] || map['DRAFT']}`}>
      {status}
    </span>
  );
}
