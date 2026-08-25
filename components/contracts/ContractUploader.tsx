'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ContractUploader() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const stages = [
    'Reading contract document...',
    'Extracting clauses & provisions...',
    'Checking financial & payment terms...',
    'Detecting high-risk liabilities...',
    'Preparing negotiation strategy...',
  ];

  const handleUpload = (file?: File) => {
    setIsUploading(true);

    stages.forEach((stage, idx) => {
      setTimeout(() => {
        setProcessingStage(stage);
        if (idx === stages.length - 1) {
          setTimeout(() => {
            setIsUploading(false);
            router.push('/contracts/1/analyze');
          }, 800);
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-brand-500" />
          <span>Upload Existing Contract</span>
        </CardTitle>
        <CardDescription>Upload PDF, DOCX, or TXT documents for instant AI risk audit & clause extraction</CardDescription>
      </CardHeader>

      {!isUploading ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files[0]);
          }}
          className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
            dragOver
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-500/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/10">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Drag & drop your contract file here</h4>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT up to 25MB</p>
          </div>
          <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all">
            Browse File
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        </div>
      ) : (
        <div className="p-10 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-extrabold text-sm text-brand-400 flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
              <span>ContractIQ Engine Processing</span>
            </h4>
            <p className="text-xs text-slate-300 font-mono">{processingStage}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
