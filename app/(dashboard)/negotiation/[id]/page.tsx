'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BATNAZOPAGauge } from '@/components/negotiation/BATNAZOPAGauge';
import { NegotiationChat } from '@/components/negotiation/NegotiationChat';
import { AICoachPanel } from '@/components/negotiation/AICoachPanel';
import { NegotiationIntelligence } from '@/components/negotiation/NegotiationIntelligence';
import { ConcessionTracker } from '@/components/negotiation/ConcessionTracker';
import { getAIProvider, CoachAdvice } from '@/lib/ai';
import { Target, Shield, CheckCircle, ArrowRight, Award, FileCheck } from 'lucide-react';

export default function NegotiationRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const aiProvider = getAIProvider();

  // Stateful Negotiation Data
  const [roundNumber, setRoundNumber] = useState(2);
  const [currentOffer, setCurrentOffer] = useState({
    salary: 68000,
    duration: '1 Year',
    noticePeriod: '30 Days',
    paymentTerms: 'Net 30',
  });

  const [targetValue] = useState(75000);
  const [minimumValue] = useState(65000);
  const [batnaValue] = useState(68000);

  const [messages, setMessages] = useState<Array<{ sender: 'USER' | 'OPPONENT' | 'SYSTEM' | 'COACH'; text: string; roundNumber: number }>>([
    {
      sender: 'OPPONENT',
      text: 'We can offer ₹60,000 per month with a 2-year commitment and 90-day notice period.',
      roundNumber: 1,
    },
    {
      sender: 'USER',
      text: 'I am targeting ₹78,000 per month with a mutual 30-day notice period.',
      roundNumber: 1,
    },
    {
      sender: 'OPPONENT',
      text: '₹78,000 is outside our approved budget. I can offer ₹68,000 for a 1-year commitment and 30-day notice period.',
      roundNumber: 2,
    },
  ]);

  const [offers, setOffers] = useState<Array<any>>([
    {
      roundNumber: 1,
      offerBy: 'OPPONENT',
      salary: 60000,
      duration: '2 Years',
      noticePeriod: '90 Days',
      paymentTerms: 'Net 60',
      status: 'COUNTERED',
    },
    {
      roundNumber: 2,
      offerBy: 'OPPONENT',
      salary: 68000,
      duration: '1 Year',
      noticePeriod: '30 Days',
      paymentTerms: 'Net 30',
      status: 'PENDING',
    },
  ]);

  const [concessions, setConcessions] = useState<Array<any>>([
    {
      madeBy: 'OPPONENT',
      description: 'Increased monthly offer from ₹60,000 to ₹68,000 (+₹8,000)',
      valueGained: 8000,
      valueGiven: 0,
      roundNumber: 2,
    },
  ]);

  const [coachAdvice, setCoachAdvice] = useState<CoachAdvice>({
    positionScore: 82,
    opponentScore: 68,
    currentOfferText: '₹68,000',
    negotiationPower: 'HIGH',
    recommendation: `Don't increase salary again. Ask for ₹72,000 with Net 15 payment terms instead.`,
    suggestedResponse: `"I can consider ₹72,000 if we set payment terms to Net 15 and maintain the 30-day notice period."`,
    tacticalTip: 'Always link salary drops directly to non-monetary trades.',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const nextRound = roundNumber + 1;
    setRoundNumber(nextRound);

    setMessages((prev) => [...prev, { sender: 'USER', text, roundNumber: nextRound }]);
    setIsLoading(true);

    // Call AI Provider to generate stateful opponent response
    const state: any = {
      id: params.id,
      contractType: 'Employment Contract',
      userRole: 'Senior Engineer',
      opponentRole: 'HR Director',
      opponentStyle: 'Professional',
      goal: 'Maximize salary & 30-day notice',
      targetValue,
      minimumValue,
      batnaValue,
      zopaMin: 65000,
      zopaMax: 82000,
      currentOffer,
      roundNumber: nextRound,
      messages,
      offersHistory: offers,
      concessions,
    };

    const oppResp = await aiProvider.generateCounterOffer(state, text);
    const newAdvice = await aiProvider.generateCoachAdvice(state);

    setTimeout(() => {
      if (oppResp.counterOffer) {
        setCurrentOffer(oppResp.counterOffer);
        setOffers((prev) => [
          ...prev,
          {
            roundNumber: nextRound,
            offerBy: 'OPPONENT',
            salary: oppResp.counterOffer!.salary,
            duration: oppResp.counterOffer!.duration,
            noticePeriod: oppResp.counterOffer!.noticePeriod,
            paymentTerms: oppResp.counterOffer!.paymentTerms,
            status: oppResp.isAgreed ? 'ACCEPTED' : 'PENDING',
          },
        ]);
      }

      setMessages((prev) => [...prev, { sender: 'OPPONENT', text: oppResp.message, roundNumber: nextRound }]);
      setCoachAdvice(newAdvice);

      if (oppResp.concessionGiven) {
        setConcessions((prev) => [
          ...prev,
          {
            madeBy: 'OPPONENT',
            description: oppResp.concessionGiven!.description,
            valueGained: oppResp.concessionGiven!.valueGained,
            valueGiven: 0,
            roundNumber: nextRound,
          },
        ]);
      }

      setIsLoading(false);

      if (oppResp.isAgreed) {
        setTimeout(() => {
          router.push(`/negotiation/${params.id}/report`);
        }, 1500);
      }
    }, 900);
  };

  const handleAcceptOffer = () => {
    router.push(`/negotiation/${params.id}/report`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info">LIVE NEGOTIATION ROOM</Badge>
            <span className="text-xs text-slate-400">• Opponent: HR Director (Professional)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Salary & Terms AI Negotiation</h1>
        </div>

        <Link
          href={`/negotiation/${params.id}/report`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-500 hover:to-accent-violet text-white text-xs font-extrabold shadow-lg shadow-brand-500/20 transition-all"
        >
          <Award className="w-4 h-4" />
          <span>Finalize Deal & View Score</span>
        </Link>
      </div>

      {/* Core 3-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (3 cols): Objectives & BATNA / ZOPA */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-brand-400">Objectives & Targets</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Value:</span>
                <span className="font-extrabold text-emerald-400">₹{targetValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Minimum Value:</span>
                <span className="font-extrabold text-slate-200">₹{minimumValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BATNA Value:</span>
                <span className="font-extrabold text-amber-400">₹{batnaValue.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Gauges */}
          <BATNAZOPAGauge
            currentOffer={currentOffer.salary}
            target={targetValue}
            minimum={minimumValue}
            batna={batnaValue}
            zopaMin={65000}
            zopaMax={82000}
          />
        </div>

        {/* CENTER COLUMN (6 cols): Negotiation Chat Feed & Offers */}
        <div className="lg:col-span-6 space-y-4">
          <NegotiationChat
            messages={messages}
            offers={offers}
            onSendMessage={handleSendMessage}
            onAcceptOffer={handleAcceptOffer}
            onCounterOffer={() => handleSendMessage(`I propose ₹72,000 with a mutual 30-day notice period.`)}
            isLoading={isLoading}
          />
        </div>

        {/* RIGHT COLUMN (3 cols): Real-Time AI Coach & Intelligence */}
        <div className="lg:col-span-3 space-y-4">
          <AICoachPanel advice={coachAdvice} onUseSuggestion={(sug) => handleSendMessage(sug)} />

          <NegotiationIntelligence
            positionScore={coachAdvice.positionScore}
            opponentScore={coachAdvice.opponentScore}
            power={coachAdvice.negotiationPower}
            concessionGivenCount={0}
            concessionReceivedCount={concessions.length}
            currentRisk="MODERATE"
          />

          <ConcessionTracker concessions={concessions} />
        </div>
      </div>
    </div>
  );
}
