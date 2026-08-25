import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FloatingAIAssistant } from '@/components/layout/FloatingAIAssistant';
import { LegalDisclaimerBanner } from '@/components/layout/LegalDisclaimerBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
        <LegalDisclaimerBanner />
      </div>

      {/* Global Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}
