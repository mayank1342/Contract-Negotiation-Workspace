'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, CheckCircle2, Trash2, CornerDownRight, Loader2 } from 'lucide-react';

interface CommentThreadProps {
  contractId: string;
  userId: string;
}

export function CommentThread({ contractId, userId }: CommentThreadProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [clauseRef, setClauseRef] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await fetch(`/api/contracts/${contractId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          content: newComment,
          clauseRef: clauseRef.trim() ? `clause:${clauseRef.trim()}` : '',
        }),
      });
      setNewComment('');
      setClauseRef('');
      fetchComments();
    } catch {
      //
    } finally {
      setPosting(false);
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      await fetch(`/api/contracts/${contractId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          content: replyText,
          parentId,
        }),
      });
      setReplyText('');
      setReplyTo(null);
      fetchComments();
    } catch {
      //
    } finally {
      setPosting(false);
    }
  };

  const handleToggleResolve = async (commentId: string, currentStatus: boolean) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isResolved: !currentStatus }),
    });
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    await fetch(`/api/comments/${commentId}?userId=${userId}`, { method: 'DELETE' });
    fetchComments();
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-white">
        <MessageSquare className="w-4 h-4 text-brand-400" /> Comments & Discussion ({comments.length})
      </div>

      {/* New Comment Box */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <input
          placeholder="Clause reference (optional, e.g. Payment Terms)..."
          value={clauseRef}
          onChange={(e) => setClauseRef(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <textarea
          placeholder="Add a comment or feedback..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handlePostComment}
            disabled={posting || !newComment.trim()}
            className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all flex items-center gap-1 disabled:opacity-50"
          >
            {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Post
          </button>
        </div>
      </div>

      {/* Comments Feed */}
      {loading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 italic">No comments on this contract yet.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-xl border transition-all ${
                c.isResolved ? 'bg-slate-950/40 border-slate-850 opacity-60' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{c.user?.name || 'User'}</span>
                  {c.clauseRef && (
                    <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[10px] font-mono">
                      {c.clauseRef.replace('clause:', '')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleResolve(c.id, c.isResolved)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      c.isResolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> {c.isResolved ? 'Resolved' : 'Resolve'}
                  </button>
                  {c.userId === userId && (
                    <button onClick={() => handleDelete(c.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-200 mt-1.5 leading-relaxed">{c.content}</p>

              {/* Replies */}
              {c.replies?.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-slate-800 space-y-2 pt-1">
                  {c.replies.map((r: any) => (
                    <div key={r.id} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-brand-400 flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3" /> {r.user?.name}
                        </span>
                        {r.userId === userId && (
                          <button onClick={() => handleDelete(r.id)} className="text-slate-500 hover:text-rose-400">
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-300 pl-4">{r.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box Toggle */}
              {replyTo === c.id ? (
                <div className="mt-2 flex gap-2">
                  <input
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handlePostReply(c.id)}
                    disabled={posting}
                    className="px-3 py-1 bg-brand-600 text-white rounded-lg font-bold"
                  >
                    Reply
                  </button>
                  <button onClick={() => setReplyTo(null)} className="text-slate-400">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyTo(c.id)}
                  className="mt-2 text-[10px] font-bold text-slate-400 hover:text-brand-400 flex items-center gap-1"
                >
                  <CornerDownRight className="w-3 h-3" /> Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
