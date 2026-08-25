'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  GraduationCap,
  BarChart3,
  User,
  Settings,
  Zap,
  Shield,
  PlusCircle,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contracts', label: 'Contracts Hub', icon: FileText },
  { href: '/negotiation', label: 'AI Simulator', icon: MessageSquare },
  { href: '/workshop', label: 'Workshop', icon: GraduationCap },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const secondaryNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col h-screen sticky top-0 bg-slate-900 border-r border-slate-800 text-slate-300 z-30">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-white tracking-tight leading-none group-hover:text-brand-400 transition-colors">
              Contract<span className="text-brand-400">IQ</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">AI Workshop</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <Link
          href="/contracts/new"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Contract</span>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div className="space-y-1">
          <span className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Main Menu</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-brand-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <span className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">System</span>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gamification Progress Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Level 3 Negotiator</span>
            </div>
            <span className="text-amber-400 font-extrabold text-[11px]">450 XP</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-brand-400 rounded-full w-3/4" />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
            <span>Streak: 🔥 4 Days</span>
            <span>Next Level: 600 XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
