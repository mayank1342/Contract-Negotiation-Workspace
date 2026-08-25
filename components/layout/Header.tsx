'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bot, Sparkles, Bell, ShieldCheck, Cpu } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLiveAi, setIsLiveAi] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 w-full glass-panel border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Search Bar Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl text-sm font-medium transition-all w-full max-w-sm border border-slate-200 dark:border-slate-700/60"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left">Search contracts, clauses, lessons...</span>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600">
            ⌘K
          </kbd>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Demo / Live AI Toggle Pill */}
          <button
            onClick={() => setIsLiveAi(!isLiveAi)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
              isLiveAi
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30'
            }`}
            title="Click to toggle between Demo AI Mode and Live API Key Mode"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isLiveAi ? 'Live AI Mode' : 'Demo AI Mode'}</span>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          </button>

          {/* Notifications Button */}
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </Link>

          {/* User Profile Summary */}
          <Link href="/profile" className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center text-white font-bold text-xs shadow-md">
              AM
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Alex Morgan</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Freelancer</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
