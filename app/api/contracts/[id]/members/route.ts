import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/members
export async function GET(req: NextRequest, { params }: Params) {
  const members = await prisma.contractPermission.findMany({
    where: { contractId: params.id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ members });
}
