'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, FileText, MessageSquare, GraduationCap, ShieldAlert } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockSearchData = [
  { type: 'contract', title: 'Senior Software Engineer Employment Agreement', href: '/contracts/1', category: 'Employment' },
  { type: 'contract', title: 'SaaS Enterprise Service Agreement', href: '/contracts/2', category: 'Service' },
  { type: 'negotiation', title: 'Salary & Terms Negotiation - Senior Engineer', href: '/negotiation/1', category: 'Active Negotiation' },
  { type: 'workshop', title: 'Lesson 1: Negotiation Basics & Mindset', href: '/workshop/1', category: 'Workshop' },
  { type: 'workshop', title: 'Lesson 2: BATNA (Best Alternative to Negotiated Agreement)', href: '/workshop/2', category: 'Workshop' },
  { type: 'clause', title: 'Asymmetric Termination Notice (90 Days)', href: '/contracts/1/analyze', category: 'Risk Clause' },
];

export function GlobalSearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via keydown handled in Header
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = mockSearchData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts, clauses, negotiations, workshop..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No matching contracts, negotiations, or lessons found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon =
                item.type === 'contract'
                  ? FileText
                  : item.type === 'negotiation'
                  ? MessageSquare
                  : item.type === 'workshop'
                  ? GraduationCap
                  : ShieldAlert;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.category}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
