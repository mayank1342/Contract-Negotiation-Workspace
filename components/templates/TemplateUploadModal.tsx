'use client';

import React, { useState, useCallback } from 'react';
import { X, UploadCloud, FileText, Loader2, Sparkles, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const CONTRACT_TYPES = [
  'NDA', 'Employment Contract', 'Service Agreement', 'Freelance Contract',
  'Rental Agreement', 'Partnership Agreement', 'Vendor Agreement', 'SaaS Agreement', 'General',
];

interface TemplateUploadModalProps {
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}

type Stage = 'upload' | 'review' | 'saving' | 'done';

export function TemplateUploadModal({ userId, onClose, onSaved }: TemplateUploadModalProps) {
  const [stage, setStage] = useState<Stage>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  // Extracted data
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [detectedVars, setDetectedVars] = useState<string[]>([]);

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState('General');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const handleFile = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Only PDF, DOCX, TXT files are supported.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File too large. Maximum 25MB.');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress('Reading file...');

    const stages = ['Parsing document...', 'Extracting text content...', 'Detecting template variables...', 'Finalizing...'];
    stages.forEach((s, i) => {
      setTimeout(() => setUploadProgress(s), i * 700);
    });

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('userId', userId);

      const res = await fetch('/api/templates/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();

      setFileUrl(data.fileUrl);
      setFileType(data.fileType);
      setExtractedText(data.extractedText);
      setDetectedVars(data.detectedVariables || []);
      setContent(data.extractedText);
      setName(file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
      setStage('review');
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [userId]);

  const handleSave = async () => {
    if (!name.trim()) { setError('Template name is required.'); return; }
    if (!content.trim()) { setError('Content is required.'); return; }
    setStage('saving');
    setError('');

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, type, description, content, fileUrl, fileType }),
      });
      if (!res.ok) throw new Error('Save failed');
      setStage('done');
      setTimeout(onSaved, 1200);
    } catch {
      setError('Failed to save template.');
      setStage('review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-violet to-brand-500 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Template</h2>
              <p className="text-xs text-slate-400">PDF, DOCX, or TXT — text will be auto-extracted</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Stage: Upload */}
          {(stage === 'upload') && (
            <div>
              {!uploading ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                  className={`p-12 border-2 border-dashed rounded-2xl flex flex-col items-center gap-4 transition-all cursor-pointer ${
                    dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-900/40 hover:border-brand-500/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7 text-brand-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white text-sm">Drag & drop your template file here</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT — up to 25MB</p>
                  </div>
                  <label className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold cursor-pointer transition-all">
                    Browse File
                    <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-brand-400 flex items-center gap-2 justify-center">
                      <Sparkles className="w-4 h-4 animate-pulse text-amber-300" /> Processing Document
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-1">{uploadProgress}</p>
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-rose-400 mt-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
            </div>
          )}

          {/* Stage: Review */}
          {stage === 'review' && (
            <div className="space-y-4">
              {detectedVars.length > 0 && (
                <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                  <p className="text-xs font-bold text-brand-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Detected {detectedVars.length} variable{detectedVars.length !== 1 ? 's' : ''} in document
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedVars.map((v) => (
                      <code key={v} className="px-2 py-0.5 rounded-full text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">{`{{${v}}}`}</code>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Template Name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Contract Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    {CONTRACT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Description (optional)</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe this template..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Extracted Content (editable)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              {error && <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-gradient-to-r from-accent-violet to-brand-500 text-white text-sm font-bold transition-all">
                  Save Template
                </button>
              </div>
            </div>
          )}

          {/* Stage: Saving */}
          {stage === 'saving' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-sm text-slate-300">Saving template...</p>
            </div>
          )}

          {/* Stage: Done */}
          {stage === 'done' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-white">Template Saved!</p>
              <p className="text-sm text-slate-400">Redirecting to your library...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
