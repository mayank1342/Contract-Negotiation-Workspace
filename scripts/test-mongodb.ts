import dotenv from 'dotenv';
dotenv.config();

import connectMongoDB from '../lib/db/mongodb';
import ContractModel from '../lib/models/Contract';
import TemplateModel from '../lib/models/Template';
import NegotiationModel from '../lib/models/Negotiation';
import UserProgressModel from '../lib/models/UserProgress';
import UserModel from '../lib/models/User';

async function testAndSeedMongoDB() {
  console.log('--- Testing MongoDB Atlas Connection & Seeding ---');
  
  const uri = process.env.MONGO_URI || '';
  if (!uri || uri.includes('<PASSWORD>')) {
    console.log('Skipping database seed test: Please replace <PASSWORD> in .env with your real MongoDB Atlas password!');
    process.exit(0);
  }

  try {
    await connectMongoDB();
    console.log('Connected to MongoDB Atlas!');

    // 1. Seed/Upsert Demo User
    const user = await UserModel.findOneAndUpdate(
      { email: 'demo@contractiq.com' },
      {
        email: 'demo@contractiq.com',
        name: 'Alex Morgan',
        role: 'Freelancer',
        experience: 'Intermediate',
        preferredStyle: 'Professional',
        mainGoal: 'Maximize compensation & minimize risk',
      },
      { upsert: true, new: true }
    );
    console.log('User model verified/seeded:', user.email);

    // 2. Seed Sample Contract
    const contract = await ContractModel.create({
      userId: 'demo-user-1',
      title: 'Senior Software Engineer Employment Agreement',
      type: 'Employment Contract',
      status: 'ANALYZED',
      overallRisk: 78,
      financialRisk: 82,
      terminationRisk: 90,
      liabilityRisk: 75,
      paymentRisk: 68,
      ipRisk: 72,
      content: 'EMPLOYMENT AGREEMENT\n\n1. Base salary: ₹60,000 / month.\n2. Net 60 days payment terms.\n3. Mutual 30 days notice.',
      clauses: [
        {
          title: 'Net 60 Payment Terms',
          text: 'Payment shall be remitted on Net 60 days.',
          category: 'Financial',
          riskLevel: 'HIGH',
          simpleExplanation: 'Payments are delayed by 2 months.',
          whyItMatters: 'Causes cash flow problems.',
          suggestedImprovement: 'Change to Net 15.',
        },
      ],
    });
    console.log('Contract created in MongoDB Atlas:', contract.title, '(_id:', contract._id, ')');

    // 3. Seed Sample Template
    const template = await TemplateModel.create({
      userId: 'demo-user-1',
      name: 'Standard Mutual NDA Template',
      type: 'NDA',
      description: 'Standard two-way Non-Disclosure Agreement for proprietary data & software IP.',
      content: 'MUTUAL NDA between {{PARTY_1_NAME}} and {{PARTY_2_NAME}}.',
      variables: [
        { key: 'PARTY_1_NAME', label: 'Party 1 Name' },
        { key: 'PARTY_2_NAME', label: 'Party 2 Name' },
      ],
    });
    console.log('Template created in MongoDB Atlas:', template.name, '(_id:', template._id, ')');

    // 4. Seed Sample Negotiation
    const negotiation = await NegotiationModel.create({
      userId: 'demo-user-1',
      title: 'Salary & Terms Negotiation - Senior Engineer',
      opponentRole: 'HR Director',
      opponentStyle: 'Professional',
      userRole: 'Senior Engineer Candidate',
      goal: 'Achieve ₹75,000/mo salary and 30-day notice period',
      targetValue: 75000,
      minimumValue: 68000,
      batnaValue: 70000,
      status: 'AGREED',
      overallScore: 88,
      messages: [
        { sender: 'OPPONENT', text: 'We offer ₹60,000 per month with a 2-year commitment.', roundNumber: 1 },
        { sender: 'USER', text: 'I accept ₹72,000 per month with a 30-day notice period.', roundNumber: 2 },
      ],
    });
    console.log('Negotiation room created in MongoDB Atlas:', negotiation.title, '(_id:', negotiation._id, ')');

    // 5. Seed User Progress
    const progress = await UserProgressModel.findOneAndUpdate(
      { userId: 'demo-user-1' },
      {
        userId: 'demo-user-1',
        xp: 450,
        level: 3,
        currentStreak: 4,
        completedLessons: ['1', '2'],
        badges: [
          { badgeKey: 'first_deal', title: 'First Deal', description: 'Completed first AI contract negotiation', icon: 'Handshake' },
        ],
      },
      { upsert: true, new: true }
    );
    console.log('User progress verified in MongoDB Atlas: XP', progress.xp, 'Level', progress.level);

    console.log('--- MongoDB Atlas end-to-end test completed successfully! ---');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB test failed:', err);
    process.exit(1);
  }
}

testAndSeedMongoDB();
