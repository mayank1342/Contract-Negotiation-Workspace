import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ContractIQ database...');

  // 1. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@contractiq.com' },
    update: {},
    create: {
      email: 'demo@contractiq.com',
      name: 'Alex Morgan',
      role: 'Freelancer',
      experience: 'Intermediate',
      preferredStyle: 'Professional',
      mainGoal: 'Maximize compensation & minimize unfair termination risk',
      userProgress: {
        create: {
          xp: 450,
          level: 3,
          currentStreak: 4,
          completedLessons: JSON.stringify(['l1', 'l2']),
          completedQuizzes: JSON.stringify(['q1', 'q2']),
        },
      },
      badges: {
        create: [
          {
            badgeKey: 'first_deal',
            title: 'First Deal',
            description: 'Completed your first AI contract negotiation',
            icon: 'Handshake',
          },
          {
            badgeKey: 'risk_hunter',
            title: 'Risk Hunter',
            description: 'Identified 5 high-risk clauses in contracts',
            icon: 'ShieldAlert',
          },
          {
            badgeKey: 'batna_expert',
            title: 'BATNA Expert',
            description: 'Calculated and enforced BATNA threshold in a negotiation',
            icon: 'Target',
          },
        ],
      },
      notifications: {
        create: [
          {
            title: 'Negotiation Completed',
            message: 'Your negotiation for Senior Engineer Employment Agreement scored 88/100!',
            type: 'SUCCESS',
          },
          {
            title: 'Risk Alert',
            message: 'High financial risk detected in Freelance Design Contract (Net 90 payment terms).',
            type: 'WARNING',
          },
        ],
      },
    },
  });

  console.log(`Created Demo User: ${demoUser.email} (${demoUser.id})`);

  // 2. Create Sample Contracts
  const contract1 = await prisma.contract.create({
    data: {
      userId: demoUser.id,
      title: 'Senior Software Engineer Employment Agreement',
      type: 'Employment Contract',
      status: 'ANALYZED',
      overallRisk: 78,
      financialRisk: 82,
      terminationRisk: 90,
      liabilityRisk: 75,
      paymentRisk: 68,
      ipRisk: 72,
      content: `EMPLOYMENT AGREEMENT

This Senior Software Engineer Employment Agreement ("Agreement") is made between TechGlobal Solutions Inc. ("Company") and Alex Morgan ("Employee").

1. POSITION & DUTIES
Employee shall serve as Senior Full Stack Engineer, performing duties assigned by Chief Technology Officer.

2. COMPENSATION
Base salary shall be ₹60,000 per month. Payment shall be remitted on Net 60 days following monthly evaluation.

3. DURATION & TERMINATION
This agreement is for a period of 2 years. Either party may terminate with 90 days notice. The Company reserves the right to terminate immediately for convenience with 1 week severance pay.

4. INTELLECTUAL PROPERTY
All code, inventions, and software produced during or outside work hours belong exclusively to the Company.

5. NON-COMPETE
Employee shall not engage in any competing software enterprise globally for 24 months post-termination.`,
      clauses: {
        create: [
          {
            title: 'Compensation & Extended Payment Cycle',
            text: 'Base salary shall be ₹60,000 per month. Payment shall be remitted on Net 60 days following monthly evaluation.',
            category: 'Financial',
            riskLevel: 'HIGH',
            simpleExplanation: 'You get ₹60,000 per month, but payments are delayed by 2 months.',
            proExplanation: 'Base compensation is ₹60,000/mo, subject to a Net 60 disbursement lag tied to subjective monthly evaluation.',
            studentExplanation: 'Imagine working in January but receiving January salary in late March.',
            whyItMatters: 'Delayed payment affects personal cash flow and gives company leverage.',
            suggestedImprovement: 'Change to Net 15 or 1st day of month payroll.',
            negotiationStrategy: 'Request standard monthly payroll disbursement.',
          },
          {
            title: 'Asymmetric Termination Notice',
            text: 'Either party may terminate with 90 days notice. The Company reserves the right to terminate immediately for convenience with 1 week severance pay.',
            category: 'Termination',
            riskLevel: 'HIGH',
            simpleExplanation: 'You must give 3 months notice to quit, but they can fire you with 1 week pay.',
            proExplanation: 'One-sided termination rights create a severe contractual imbalance.',
            studentExplanation: 'You are locked in for 90 days, but they can drop you in 7 days.',
            whyItMatters: 'Restricts job mobility while offering zero job security.',
            suggestedImprovement: 'Mutual 30-day notice period with 1 month severance pay.',
            negotiationStrategy: 'Frame mutual 30 days as standard industry practice.',
          },
        ],
      },
      riskReports: {
        create: [
          {
            riskType: 'Termination Risk',
            level: 'HIGH',
            title: 'Unilateral Immediate Termination',
            description: 'Employer can terminate immediately with 1 week pay, while employee must give 90 days.',
            recommendation: 'Negotiate mutual 30-day notice period.',
          },
          {
            riskType: 'Financial Risk',
            level: 'HIGH',
            title: 'Net 60 Payment Lag',
            description: 'Salary payments are delayed by 60 days.',
            recommendation: 'Request standard 1st-of-month payroll cycle.',
          },
        ],
      },
    },
  });

  const contract2 = await prisma.contract.create({
    data: {
      userId: demoUser.id,
      title: 'SaaS Enterprise Service Agreement',
      type: 'Service Agreement',
      status: 'NEGOTIATING',
      overallRisk: 62,
      financialRisk: 55,
      terminationRisk: 60,
      liabilityRisk: 80,
      paymentRisk: 50,
      ipRisk: 65,
      content: `ENTERPRISE SERVICE AGREEMENT

This Agreement is entered into between CloudMatrix Corp ("Provider") and EnterpriseClient Inc ("Client").

1. SERVICES PROVIDED
Provider agrees to grant access to Enterprise Contract Platform with 99.5% uptime.

2. FEES
Annual subscription fee of ₹5,00,000 payable upfront annually.

3. INDEMNIFICATION & LIABILITY
Provider indemnifies Client against all third party claims with unlimited liability coverage.`,
      clauses: {
        create: [
          {
            title: 'Unlimited Liability Clause',
            text: 'Provider indemnifies Client against all third party claims with unlimited liability coverage.',
            category: 'Liability',
            riskLevel: 'HIGH',
            simpleExplanation: 'You are responsible for unlimited financial damages if a customer sues.',
            proExplanation: 'Absence of an aggregate liability cap exposes business to catastrophic financial risk.',
            studentExplanation: 'If something goes wrong, you could be sued for more money than your entire company is worth.',
            whyItMatters: 'Unlimited liability can bankrupt a provider.',
            suggestedImprovement: 'Cap liability at total annual subscription fees paid (₹5,00,000).',
            negotiationStrategy: 'Insist on a 1x annual fee liability cap.',
          },
        ],
      },
    },
  });

  // 3. Create Sample Negotiation & Replay
  const negotiation1 = await prisma.negotiation.create({
    data: {
      contractId: contract1.id,
      userId: demoUser.id,
      title: 'Salary & Terms Negotiation - Senior Engineer',
      opponentRole: 'HR Director',
      opponentStyle: 'Professional',
      userRole: 'Senior Engineer Candidate',
      goal: 'Achieve ₹75,000/mo salary and 30-day notice period',
      targetValue: 75000,
      minimumValue: 68000,
      batnaValue: 70000,
      zopaMin: 68000,
      zopaMax: 82000,
      status: 'AGREED',
      overallScore: 88,
      messages: {
        create: [
          {
            sender: 'OPPONENT',
            text: 'We are pleased to offer you ₹60,000 per month with a 2-year commitment and 90-day notice period.',
            roundNumber: 1,
          },
          {
            sender: 'USER',
            text: 'Thank you for the offer. Based on my experience and current market rates, I am targeting ₹78,000 per month with a 30-day notice period.',
            roundNumber: 1,
          },
          {
            sender: 'OPPONENT',
            text: '₹78,000 is beyond our approved budget tier. I can adjust our offer to ₹68,000 per month with a 1-year contract commitment.',
            roundNumber: 2,
          },
          {
            sender: 'USER',
            text: 'I appreciate the adjustment. If we can finalize the notice period at a mutual 30 days and set payment on Net 15, I can accept ₹72,000 per month.',
            roundNumber: 2,
          },
          {
            sender: 'OPPONENT',
            text: 'We accept ₹72,000 per month with a 1-year contract, mutual 30-day notice period, and Net 15 payment terms!',
            roundNumber: 3,
          },
        ],
      },
      offers: {
        create: [
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
            offerBy: 'USER',
            salary: 78000,
            duration: '1 Year',
            noticePeriod: '30 Days',
            paymentTerms: 'Net 15',
            status: 'COUNTERED',
          },
          {
            roundNumber: 3,
            offerBy: 'OPPONENT',
            salary: 72000,
            duration: '1 Year',
            noticePeriod: '30 Days',
            paymentTerms: 'Net 15',
            status: 'ACCEPTED',
          },
        ],
      },
      concessions: {
        create: [
          {
            roundNumber: 2,
            madeBy: 'OPPONENT',
            description: 'Increased salary offer from ₹60,000 to ₹68,000 (+₹8,000)',
            valueGained: 8000,
            valueGiven: 0,
          },
          {
            roundNumber: 2,
            madeBy: 'USER',
            description: 'Reduced salary demand from ₹78,000 to ₹72,000 (-₹6,000) in exchange for 30-day notice',
            valueGained: 0,
            valueGiven: 6000,
          },
        ],
      },
      score: {
        create: {
          overallScore: 88,
          communicationScore: 92,
          preparationScore: 90,
          priceScore: 85,
          riskScore: 88,
          concessionScore: 82,
          strategyScore: 91,
          strengths: JSON.stringify([
            'Maintained clear BATNA benchmark throughout negotiation',
            'Traded salary concession directly for notice period reduction',
            'Polite, assertive communication style',
          ]),
          weaknesses: JSON.stringify([
            'Opened with a steep anchor (₹78,000) that pushed opponent near max budget',
            'Could have requested annual bonus component',
          ]),
          valueSaved: 12000,
        },
      },
      replay: {
        create: {
          roundData: JSON.stringify([
            {
              round: 1,
              userMsg: 'Targeting ₹78,000/mo with 30-day notice',
              oppMsg: 'Offered ₹60,000/mo with 2-year term',
              userOffer: 78000,
              oppOffer: 60000,
              insight: 'Good initial anchor, establishing high aspiration value.',
            },
            {
              round: 2,
              userMsg: 'Proposed ₹72,000 with mutual 30-day notice and Net 15',
              oppMsg: 'Countered with ₹68,000/mo with 1-year term',
              userOffer: 72000,
              oppOffer: 68000,
              insight: 'Excellent conditional concession! Linked salary drop to notice reduction.',
            },
            {
              round: 3,
              userMsg: 'Agreed to ₹72,000/mo',
              oppMsg: 'Accepted final proposal',
              userOffer: 72000,
              oppOffer: 72000,
              insight: 'Successfully closed above BATNA (₹70,000) and within ZOPA!',
            },
          ]),
          insights: JSON.stringify([
            'You gained ₹12,000/month over initial offer (+20% total value).',
            'Reduced notice period by 60 days, significantly mitigating career lock-in risk.',
          ]),
        },
      },
    },
  });

  // 4. Create Workshop Lessons & Scenarios
  const workshop = await prisma.workshop.create({
    data: {
      title: 'Mastering AI Contract Negotiation',
      description: 'Comprehensive 10-lesson mastery course on contract risk, BATNA, ZOPA, anchoring, and closing deals.',
      category: 'Foundations',
      lessonCount: 10,
      lessons: {
        create: [
          {
            order: 1,
            title: 'Negotiation Basics & Mindset',
            summary: 'Learn the fundamental psychology of contract negotiation and value creation.',
            theory: 'Contract negotiation is not a zero-sum battle. It is a joint problem-solving exercise where both parties aim to maximize total value while protecting core risks.',
            exampleText: 'Instead of fighting over a ₹5,000 price gap, negotiate contract length, payment terms, or scope to expand the total value pool.',
            quizzes: {
              create: [
                {
                  question: 'What is the primary goal of modern contract negotiation?',
                  options: JSON.stringify([
                    'Winning at all costs by destroying the other party',
                    'Joint problem-solving to maximize value and manage risk',
                    'Accepting the first offer immediately',
                    'Refusing to make any concessions',
                  ]),
                  correctAnswer: 1,
                  explanation: 'Effective negotiation creates mutual value while safeguarding critical contract terms.',
                },
              ],
            },
          },
          {
            order: 2,
            title: 'BATNA (Best Alternative to a Negotiated Agreement)',
            summary: 'Master your walk-away point and calculate your negotiation leverage.',
            theory: 'Your BATNA is your absolute fallback if the negotiation fails. A strong BATNA gives you high leverage because you are never forced to accept a bad deal.',
            exampleText: 'If you already have a freelance offer paying ₹70,000/mo, your BATNA is ₹70,000. Any contract below ₹70,000 should be rejected.',
            quizzes: {
              create: [
                {
                  question: 'When should you walk away from a contract negotiation?',
                  options: JSON.stringify([
                    'Whenever the opponent disagrees with your first sentence',
                    'When the current offer is worse than your BATNA',
                    'After 2 rounds of messaging',
                    'Never walk away under any circumstance',
                  ]),
                  correctAnswer: 1,
                  explanation: 'If a deal is worse than your BATNA, you are financially and strategically better off taking your alternative.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
