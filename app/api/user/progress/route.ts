import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectMongoDB from '@/lib/db/mongodb';
import UserProgressModel from '@/lib/models/UserProgress';
import { getSessionUser } from '@/lib/auth';

const FALLBACK_USER_ID = 'demo-user-1';

// GET /api/user/progress — Read user XP & progress
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || searchParams.get('userId') || FALLBACK_USER_ID;

    let progress = await UserProgressModel.findOne({ userId }).lean();

    if (!progress) {
      // Create default progress if not found
      const newProgress = await UserProgressModel.create({
        userId,
        xp: 450,
        level: 3,
        currentStreak: 4,
        completedLessons: ['1', '2'],
        completedQuizzes: ['q1', 'q2'],
        badges: [
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
      });
      progress = newProgress.toObject();
    }

    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error('GET /api/user/progress error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch user progress' }, { status: 500 });
  }
}

// POST /api/user/progress — Update user progress/XP
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || body.userId || FALLBACK_USER_ID;
    const { lessonId, xpGained } = body;

    let progress = await UserProgressModel.findOne({ userId });

    if (!progress) {
      progress = new UserProgressModel({ userId, xp: 0, level: 1, completedLessons: [] });
    }

    if (lessonId && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    if (xpGained) {
      progress.xp += xpGained;
      progress.level = Math.floor(progress.xp / 150) + 1;
    }

    await progress.save();
    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update progress' }, { status: 500 });
  }
}
