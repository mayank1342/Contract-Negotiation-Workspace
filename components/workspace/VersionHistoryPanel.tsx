'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { History, Eye, RotateCcw, GitCompare, Loader2 } from 'lucide-react';

interface VersionHistoryPanelProps {
  contractId: string;
  userId: string;
  userRole: string;
  onVersionRestore: (content: string) => void;
}

export function VersionHistoryPanel({
  contractId,
  userId,
  userRole,
  onVersionRestore,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTarget, setCompareTarget] = useState<any>(null);
  const [restoring, setRestoring] = useState(false);

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch {
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleRestore = async (ver: any) => {
    if (!['OWNER', 'EDITOR'].includes(userRole)) return;
    if (!confirm(`Restore contract to Version v${ver.versionNumber}? This will create a new version snapshot.`)) return;

    setRestoring(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/restore/${ver.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        onVersionRestore(data.restoredContent);
        setSelectedVersion(null);
        fetchVersions();
      }
    } catch {
      //
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white flex items-center gap-1.5">
          <History className="w-4 h-4 text-brand-400" /> Version History ({versions.length})
        </span>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
        </div>
      ) : versions.length === 0 ? (
        <p className="text-slate-500 italic">No versions logged yet.</p>
      ) : (
        <div className="space-y-2 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {versions.map((ver) => (
            <div key={ver.id} className="relative flex items-start gap-3 pl-8 group">
              <div className="absolute left-2.5 top-2.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />

              <div className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white">v{ver.versionNumber}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{ver.changeDescription || ver.title}</p>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                  <span>By: {ver.changedBy || 'System'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (selectedVersion?.id === ver.id) {
                          setSelectedVersion(null);
                        } else {
                          setSelectedVersion(ver);
                          setCompareMode(false);
                        }
                      }}
                      className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    {['OWNER', 'EDITOR'].includes(userRole) && (
                      <button
                        onClick={() => handleRestore(ver)}
                        disabled={restoring}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Version Preview Modal / Card */}
      {selectedVersion && (
        <div className="p-3 rounded-xl bg-slate-900 border border-brand-500/40 space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-400">
              Preview v{selectedVersion.versionNumber}
            </span>
            <button onClick={() => setSelectedVersion(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
            {selectedVersion.content}
          </div>
        </div>
      )}
    </div>
  );
}
