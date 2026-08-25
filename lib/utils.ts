import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getRiskBadgeColor(riskLevel: string) {
  switch (riskLevel.toUpperCase()) {
    case 'HIGH':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'LOW':
    default:
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  }
}

export function getRiskLabel(score: number): { label: string; color: string } {
  if (score >= 70) {
    return { label: 'HIGH RISK', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' };
  } else if (score >= 40) {
    return { label: 'MODERATE RISK', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
  } else {
    return { label: 'LOW RISK', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  }
}
