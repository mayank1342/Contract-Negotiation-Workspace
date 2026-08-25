'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, FileCheck } from 'lucide-react';
import { OfferCard } from './OfferCard';

interface Message {
  sender: 'USER' | 'OPPONENT' | 'SYSTEM' | 'COACH';
  text: string;
  roundNumber: number;
}

interface Offer {
  roundNumber: number;
  offerBy: 'USER' | 'OPPONENT';
  salary: number;
  duration: string;
  noticePeriod: string;
  paymentTerms: string;
  status: string;
}

interface ChatProps {
  messages: Message[];
  offers: Offer[];
  onSendMessage: (text: string) => void;
  onAcceptOffer: () => void;
  onCounterOffer: () => void;
  isLoading: boolean;
}

export function NegotiationChat({
  messages,
  offers,
  onSendMessage,
  onAcceptOffer,
  onCounterOffer,
  isLoading,
}: ChatProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, offers, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const latestOpponentOffer = offers.filter((o) => o.offerBy === 'OPPONENT').slice(-1)[0];

  return (
    <div className="flex flex-col h-[650px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center text-white font-bold text-xs">
            AI
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">AI Opponent Simulator</h4>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Stateful Opponent Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.sender === 'USER';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start gap-2.5 max-w-[85%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-500 px-1">
                    Round #{m.roundNumber} — {m.sender}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none shadow-md shadow-brand-500/10'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Latest Active Offer Card */}
        {latestOpponentOffer && (
          <div className="pt-2">
            <OfferCard
              roundNumber={latestOpponentOffer.roundNumber}
              offerBy={latestOpponentOffer.offerBy}
              salary={latestOpponentOffer.salary}
              duration={latestOpponentOffer.duration}
              noticePeriod={latestOpponentOffer.noticePeriod}
              paymentTerms={latestOpponentOffer.paymentTerms}
              status={latestOpponentOffer.status}
              onAccept={onAcceptOffer}
              onCounter={onCounterOffer}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              <span>AI Opponent evaluating offer & counter-proposing...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your counteroffer or rationale (e.g. 'I propose ₹72,000 with a 30-day notice period')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-brand-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
