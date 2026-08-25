'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, UserPlus, Shield, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ShareModalProps {
  contractId: string;
  userId: string;
  onClose: () => void;
}

const ROLES = [
  { key: 'OWNER', label: 'Owner', desc: 'Full access — manage content, parties, permissions' },
  { key: 'EDITOR', label: 'Editor', desc: 'Can edit contract text and request AI modifications' },
  { key: 'REVIEWER', label: 'Reviewer', desc: 'Review contract and suggest changes' },
  { key: 'COMMENTER', label: 'Commenter', desc: 'Can add and reply to comments' },
  { key: 'VIEWER', label: 'Viewer', desc: 'Read-only access' },
];

export function ShareModal({ contractId, userId, onClose }: ShareModalProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('EDITOR');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) { setError('Email is required.'); return; }
    setInviting(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/contracts/${contractId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: userId,
          inviteeEmail: inviteEmail.trim(),
          role: selectedRole,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to invite user');
      }
      setInviteEmail('');
      setSuccessMsg('User invited successfully!');
      fetchMembers();
    } catch (e: any) {
      setError(e.message || 'Invitation failed');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    await fetch(`/api/contracts/${contractId}/members/${memberId}?ownerId=${userId}`, { method: 'DELETE' });
    fetchMembers();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <span>Share Contract & Permissions</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Invite Input */}
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="font-bold text-slate-200 block">Invite User by Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="user@example.com..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              >
                {ROLES.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleInvite}
              disabled={inviting || !inviteEmail.trim()}
              className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              Send Invite
            </button>

            {error && <p className="text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
            {successMsg && <p className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{successMsg}</p>}
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
              Collaborators ({members.length})
            </span>

            {loading ? (
              <div className="py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-brand-400" /></div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {members.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{m.user?.name || m.userId}</div>
                      <div className="text-[10px] text-slate-400">{m.user?.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                        {m.role}
                      </span>
                      {m.role !== 'OWNER' && (
                        <button onClick={() => handleRemoveMember(m.id)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
