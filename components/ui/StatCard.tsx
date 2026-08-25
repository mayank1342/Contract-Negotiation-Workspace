import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, isPositive = true, icon: Icon, iconColor = 'text-brand-500 bg-brand-500/10', subtitle }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
          {change && (
            <div className="flex items-center gap-1 mt-1 text-xs font-medium">
              <span className={cn(isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {change}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          )}
          {subtitle && <span className="text-xs text-slate-400 mt-1">{subtitle}</span>}
        </div>
        <div className={cn('p-3 rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-110', iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
