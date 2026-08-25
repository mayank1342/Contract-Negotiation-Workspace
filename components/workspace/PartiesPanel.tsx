'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Trash2, Edit3, Save, Users, Loader2 } from 'lucide-react';

interface PartiesPanelProps {
  contractId: string;
  parties: any[];
  userId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function PartiesPanel({ contractId, parties, userId, onClose, onUpdated }: PartiesPanelProps) {
  const [partyList, setPartyList] = useState<any[]>(parties);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    try {
      await fetch(`/api/contracts/${contractId}/parties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: 'New Party',
          email: '',
          company: '',
          role: `Party ${partyList.length + 1}`,
        }),
      });
      onUpdated();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (partyId: string) => {
    setSaving(true);
    try {
      await fetch(`/api/parties/${partyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: newName,
          email: newEmail,
          company: newCompany,
          role: newRole,
        }),
      });
      setEditingId(null);
      onUpdated();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partyId: string) => {
    if (!confirm('Remove this party from contract?')) return;
    await fetch(`/api/parties/${partyId}?userId=${userId}`, { method: 'DELETE' });
    onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Users className="w-5 h-5 text-brand-400" />
            <span>Manage Contract Parties ({parties.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {partyList.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                {editingId === p.id ? (
                  <div className="space-y-2">
                    <input
                      placeholder="Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                      />
                      <input
                        placeholder="Company"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                      />
                    </div>
                    <input
                      placeholder="Role (e.g. Employer, Contractor)"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(p.id)} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1">
                        <Save className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.role} {p.company && `• ${p.company}`} {p.email && `• ${p.email}`}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setNewName(p.name);
                          setNewEmail(p.email || '');
                          setNewCompany(p.company || '');
                          setNewRole(p.role || '');
                        }}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4 text-brand-400" />}
            + Add Another Party
          </button>
        </div>
      </div>
    </div>
  );
}
