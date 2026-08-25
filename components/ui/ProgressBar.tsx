import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  className?: string;
  showPercentage?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, colorClass = 'bg-brand-500', className, showPercentage = false, label }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-slate-600 dark:text-slate-300">{label}</span>}
          {showPercentage && <span className="text-slate-500 font-bold">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/30 dark:border-slate-700/30">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
