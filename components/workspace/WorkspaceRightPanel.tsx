'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AIModifyPanel } from './AIModifyPanel';
import { CommentThread } from './CommentThread';
import { Activity, Clock, Loader2 } from 'lucide-react';

interface WorkspaceRightPanelProps {
  contractId: string;
  userId: string;
  userRole: string;
  activeTab: 'ai' | 'comments' | 'activity';
  contract: any;
  currentContent: string;
  onAISuggestionApply: (newContent: string, desc: string) => void;
  onVersionRestore: (content: string) => void;
}

export function WorkspaceRightPanel({
  contractId,
  userId,
  userRole,
  activeTab,
  contract,
  currentContent,
  onAISuggestionApply,
}: WorkspaceRightPanelProps) {
  if (activeTab === 'ai') {
    return (
      <AIModifyPanel
        contractId={contractId}
        userId={userId}
        userRole={userRole}
        currentContent={currentContent}
        onAISuggestionApply={onAISuggestionApply}
      />
    );
  }

  if (activeTab === 'comments') {
    return <CommentThread contractId={contractId} userId={userId} />;
  }

  if (activeTab === 'activity') {
    return <ActivityTimeline contractId={contractId} />;
  }

  return null;
}

function ActivityTimeline({ contractId }: { contractId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/activity`);
      const data = await res.json();
      setActivities(data.activities || []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-white">
        <Activity className="w-4 h-4 text-emerald-400" /> Activity Timeline ({activities.length})
      </div>

      {loading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-slate-500 italic">No activities logged yet.</p>
      ) : (
        <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative pl-6 space-y-0.5">
              <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
              <p className="text-slate-200 font-medium leading-tight">{act.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>{act.user?.name || 'User'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
