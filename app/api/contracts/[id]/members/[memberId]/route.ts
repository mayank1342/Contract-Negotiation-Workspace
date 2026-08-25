import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string; memberId: string } };

// PUT /api/contracts/:id/members/:memberId — update role
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { ownerId, role } = body;

  const ownerPerm = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId: ownerId, role: 'OWNER' },
  });
  if (!ownerPerm) return NextResponse.json({ error: 'Only owners can change roles' }, { status: 403 });

  const updated = await prisma.contractPermission.update({
    where: { id: params.memberId },
    data: { role },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ permission: updated });
}

// DELETE /api/contracts/:id/members/:memberId — remove collaborator
export async function DELETE(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get('ownerId');

  const ownerPerm = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId: ownerId || '', role: 'OWNER' },
  });
  if (!ownerPerm) return NextResponse.json({ error: 'Only owners can remove members' }, { status: 403 });

  await prisma.contractPermission.delete({ where: { id: params.memberId } });
  return NextResponse.json({ success: true });
}
