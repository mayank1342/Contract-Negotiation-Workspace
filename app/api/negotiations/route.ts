import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectMongoDB from '@/lib/db/mongodb';
import NegotiationModel from '@/lib/models/Negotiation';
import { getSessionUser } from '@/lib/auth';

const FALLBACK_USER_ID = 'demo-user-1';

// GET /api/negotiations — List negotiations
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || searchParams.get('userId') || FALLBACK_USER_ID;

    const negotiations = await NegotiationModel.find({ userId }).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({
      negotiations: negotiations.map((n: any) => ({
        id: n._id.toString(),
        title: n.title,
        opponent: `${n.opponentRole} (${n.opponentStyle})`,
        opponentRole: n.opponentRole,
        opponentStyle: n.opponentStyle,
        status: n.status,
        score: n.overallScore || 80,
        target: `₹${n.targetValue.toLocaleString()} / mo`,
        batna: `₹${n.batnaValue.toLocaleString()} / mo`,
        targetValue: n.targetValue,
        batnaValue: n.batnaValue,
        rounds: n.messages ? Math.ceil(n.messages.length / 2) : 1,
        date: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Recently',
        createdAt: n.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/negotiations error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch negotiations' }, { status: 500 });
  }
}

// POST /api/negotiations — Create a new negotiation room
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || body.userId || FALLBACK_USER_ID;

    const {
      title,
      opponentRole,
      opponentStyle,
      userRole,
      goal,
      targetValue,
      minimumValue,
      batnaValue,
      contractId,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const negotiation = await NegotiationModel.create({
      userId,
      contractId: contractId || null,
      title,
      opponentRole: opponentRole || 'HR Manager',
      opponentStyle: opponentStyle || 'Professional',
      userRole: userRole || 'Candidate',
      goal: goal || 'Maximize deal value',
      targetValue: targetValue || 75000,
      minimumValue: minimumValue || 65000,
      batnaValue: batnaValue || 68000,
      status: 'ACTIVE',
      overallScore: 80,
      messages: [
        {
          sender: 'OPPONENT',
          text: `Welcome to the room. I represent ${opponentRole || 'the organization'}. Let us discuss the terms of ${title}.`,
          roundNumber: 1,
        },
      ],
      offers: [],
    });

    return NextResponse.json(
      {
        negotiation: {
          id: negotiation._id.toString(),
          ...negotiation.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create negotiation' }, { status: 500 });
  }
}
