import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/activity
export async function GET(req: NextRequest, { params }: Params) {
  const activities = await prisma.contractActivity.findMany({
    where: { contractId: params.id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ activities });
}
