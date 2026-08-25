import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectMongoDB from '@/lib/db/mongodb';
import ContractModel from '@/lib/models/Contract';
import TemplateModel from '@/lib/models/Template';
import NegotiationModel from '@/lib/models/Negotiation';
import { getSessionUser } from '@/lib/auth';

const FALLBACK_USER_ID = 'demo-user-1';

// GET /api/dashboard — Return live metrics & recent AI negotiations from MongoDB
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || searchParams.get('userId') || FALLBACK_USER_ID;

    // Fetch counts from MongoDB
    const [totalTemplates, activeContracts, inReview, inNegotiation, completed, negotiations] =
      await Promise.all([
        TemplateModel.countDocuments({ userId }),
        ContractModel.countDocuments({ userId }),
        ContractModel.countDocuments({ userId, status: 'IN_REVIEW' }),
        NegotiationModel.countDocuments({ userId, status: 'ACTIVE' }),
        ContractModel.countDocuments({ userId, status: 'COMPLETED' }),
        NegotiationModel.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean(),
      ]);

    const recentNegotiations = negotiations.map((n: any) => ({
      id: n._id.toString(),
      title: n.title,
      type: 'AI Negotiation',
      score: n.overallScore || 80,
      status: n.status,
      opponent: `${n.opponentRole || 'HR Director'} (${n.opponentStyle || 'Professional'})`,
      valueSaved: `₹${((n.targetValue || 75000) - (n.minimumValue || 65000)).toLocaleString()}`,
      date: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Recently',
    }));

    return NextResponse.json({
      stats: {
        totalTemplates,
        activeContracts,
        inReview,
        inNegotiation,
        completed,
      },
      recentNegotiations,
    });
  } catch (error: any) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
