import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/parties
export async function GET(req: NextRequest, { params }: Params) {
  const parties = await prisma.contractParty.findMany({
    where: { contractId: params.id },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json({ parties });
}

// POST /api/contracts/:id/parties
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, name, email, company, role } = body;

  if (!userId || !name) return NextResponse.json({ error: 'userId and name required' }, { status: 400 });

  // Check permission
  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId, role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const count = await prisma.contractParty.count({ where: { contractId: params.id } });
  const party = await prisma.contractParty.create({
    data: {
      contractId: params.id,
      name,
      email: email || '',
      company: company || '',
      role: role || `Party ${count + 1}`,
      order: count + 1,
    },
  });

  await prisma.contractActivity.create({
    data: {
      contractId: params.id,
      userId,
      type: 'PARTY_ADDED',
      description: `Party "${name}" added`,
    },
  });

  return NextResponse.json({ party }, { status: 201 });
}
