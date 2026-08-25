'use client';

import React from 'react';
import { Edit3, Sparkles } from 'lucide-react';

interface WorkspaceCenterEditorProps {
  contract: any;
  editMode: boolean;
  editedContent: string;
  onContentChange: (val: string) => void;
  canEdit: boolean;
  userId: string;
  onAISuggestionApply: (newContent: string, desc: string) => void;
}

export function WorkspaceCenterEditor({
  contract,
  editMode,
  editedContent,
  onContentChange,
  canEdit,
}: WorkspaceCenterEditorProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Editor Header / Banner */}
      <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">
          {editMode ? 'Editing Mode — unsaved changes' : 'Read-Only Document View'}
        </span>
        {editMode && (
          <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
            <Edit3 className="w-3 h-3" /> Live Editing
          </span>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        {editMode ? (
          <textarea
            value={editedContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full min-h-[600px] bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed p-4 rounded-xl border border-brand-500/40 focus:outline-none focus:border-brand-400 resize-none shadow-inner"
            placeholder="Contract text..."
          />
        ) : (
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-brand-500 selection:text-white shadow-xl">
            {editedContent || contract.content}
          </div>
        )}
      </div>
    </div>
  );
}
