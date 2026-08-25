# ContractIQ — AI Contract Negotiation Workshop

> **"Don't just sign contracts. Understand, negotiate, and improve them."**

ContractIQ is a full-featured, modern, production-grade SaaS web application built with Next.js 14+ App Router, React, TypeScript, Tailwind CSS, Prisma, Framer Motion, and Recharts. It empowers users to analyze contracts, detect risk, simulate realistic AI negotiations with BATNA/ZOPA engines, receive real-time coaching, replay negotiations round-by-round, and complete legal negotiation workshops.

---

## 🌟 Core Features & Highlights

1. **AI Contract Risk Audit & Analysis**: Instant risk score dial (0-100) with category breakdowns (Financial, Termination, Liability, Payment, IP) and 3-level clause explainer (Simple, Professional, Student-Friendly).
2. **Stateful AI Negotiation Simulator**: Realistic 3-column negotiation room. Opponent AI maintains state across messages, offers, counteroffers, user priorities, opponent style (Friendly, Professional, Aggressive, Difficult), and refusal limits.
3. **BATNA & ZOPA Engines**: Real-time evaluation of Best Alternative to a Negotiated Agreement (BATNA) and Zone of Possible Agreement (ZOPA) overlap.
4. **Live AI Negotiation Coach & Intelligence**: Real-time side panel evaluating position power, concession balance, tactical recommendations, and suggested counter-proposals.
5. **Concession Tracking**: Logs concessions made by User vs Opponent to detect unbalanced trading.
6. **Negotiation Scoring & Round Replay**: Round-by-round timeline replay with *"What could I have done better?"* insights and 5-dimension score breakdown.
7. **Final Agreement Generator & PDF Exporter**: Synthesizes negotiated agreements into exportable PDFs using `jsPDF`.
8. **Interactive Workshop**: 10-lesson course with interactive scenarios, quizzes, XP rewards, and badge unlocks.
9. **What-If Simulator**: Test strategic options (*"What if I ask for 15% more?"*, *"What if notice period is 30 days?"*) before making live counteroffers.
10. **Contract Comparison**: Side-by-side clause diff highlighting improved, changed, and worse provisions.
11. **Demo AI Mode**: Works 100% offline out-of-the-box with zero API keys required, while also supporting OpenAI and Gemini API keys.
12. **Mandatory Legal Disclaimer**: Prominently displayed across all risk reports, contract preview views, exports, and footers.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Glassmorphism design tokens
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualization**: Recharts (Radar Chart, Score Trend Area Chart)
- **Database & ORM**: PostgreSQL / SQLite via Prisma ORM
- **Exporting**: jsPDF & html2canvas
- **Effects**: canvas-confetti

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="file:./dev.db"
AI_API_KEY=""
OPENAI_API_KEY=""
GEMINI_API_KEY=""
AUTH_SECRET="contractiq-super-secret-key"
```

### 3. Database Initialization & Seeding
```bash
# Push Prisma schema to create dev.db SQLite database
npx prisma db push

# Seed demo user, contracts, negotiations, workshop lessons, and badges
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── contracts/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── analyze/page.tsx
│   │   │       └── compare/page.tsx
│   │   ├── negotiation/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── report/page.tsx
│   │   ├── workshop/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── profile/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── layout/                 # Header, Sidebar, GlobalSearchModal, FloatingAIAssistant
│   ├── ui/                     # Card, Badge, StatCard, ProgressBar
│   ├── contracts/              # Wizard, Uploader, RiskScoreCard, ClauseAnalyzer, Comparator, WhatIf
│   ├── negotiation/            # SetupModal, Chat, OfferCard, AICoachPanel, BATNAZOPAGauge, Intelligence, Replay
│   ├── workshop/               # InteractiveQuiz, BadgeGrid
│   └── analytics/              # SkillsRadarChart, NegotiationScoreTrend
├── lib/
│   ├── ai/                     # AIProvider interface, DemoAIProvider, OpenAIProvider, GeminiProvider
│   ├── db/                     # Prisma singleton
│   ├── services/               # BATNAService, ZOPAService, ContractExporterService
│   └── utils.ts
├── prisma/
│   ├── schema.prisma           # Relational schema
│   └── seed.ts                 # Demo seed script
```

---

## ⚖️ Legal Disclaimer

> **ContractIQ provides AI-generated information for educational and informational purposes only. It is not legal advice and does not replace a qualified lawyer.**
