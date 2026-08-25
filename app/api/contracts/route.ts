import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectMongoDB from '@/lib/db/mongodb';
import ContractModel from '@/lib/models/Contract';
import { getSessionUser } from '@/lib/auth';

const FALLBACK_USER_ID = 'demo-user-1';

// GET /api/contracts — List contracts for current user
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || searchParams.get('userId') || FALLBACK_USER_ID;
    const search = searchParams.get('search') || '';

    const filter: any = { userId };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    const contracts = await ContractModel.find(filter).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({
      contracts: contracts.map((c: any) => ({
        id: c._id.toString(),
        title: c.title,
        type: c.type,
        status: c.status,
        overallRisk: c.overallRisk,
        riskScore: c.overallRisk,
        clausesCount: c.clauses?.length || 0,
        content: c.content,
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Just now',
        createdAt: c.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/contracts error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch contracts' }, { status: 500 });
  }
}

// POST /api/contracts — Create a new contract
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || body.userId || FALLBACK_USER_ID;

    const { title, type, content, sourceType, overallRisk, clauses, parties } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newContract = await ContractModel.create({
      userId,
      title,
      type: type || 'Employment Contract',
      content,
      sourceType: sourceType || 'UPLOADED',
      overallRisk: overallRisk !== undefined ? overallRisk : 50,
      clauses: clauses || [],
      parties: parties || [],
      versions: [
        {
          versionNumber: 1,
          title: 'v1.0 Initial Draft',
          content,
          riskScore: overallRisk !== undefined ? overallRisk : 50,
          changedBy: 'User',
          changeDescription: 'Contract created',
        },
      ],
    });

    return NextResponse.json(
      {
        contract: {
          id: newContract._id.toString(),
          ...newContract.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/contracts error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create contract' }, { status: 500 });
  }
}
