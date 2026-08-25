import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { partyId: string } };

// PUT /api/parties/:partyId
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, name, email, company, role } = body;

  const party = await prisma.contractParty.findUnique({ where: { id: params.partyId } });
  if (!party) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: party.contractId, userId, role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.contractParty.update({
    where: { id: params.partyId },
    data: {
      ...(name && { name }),
      ...(email !== undefined && { email }),
      ...(company !== undefined && { company }),
      ...(role && { role }),
    },
  });

  return NextResponse.json({ party: updated });
}

// DELETE /api/parties/:partyId
export async function DELETE(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const party = await prisma.contractParty.findUnique({ where: { id: params.partyId } });
  if (!party) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: party.contractId, userId: userId || '', role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.contractParty.delete({ where: { id: params.partyId } });
  return NextResponse.json({ success: true });
}
