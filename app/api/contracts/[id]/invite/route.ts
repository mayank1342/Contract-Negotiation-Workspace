import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// POST /api/contracts/:id/invite
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { ownerId, inviteeEmail, role } = body;
  // role: EDITOR | REVIEWER | COMMENTER | VIEWER

  if (!ownerId || !inviteeEmail || !role) {
    return NextResponse.json({ error: 'ownerId, inviteeEmail, and role required' }, { status: 400 });
  }

  // Check caller is owner
  const ownerPerm = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId: ownerId, role: 'OWNER' },
  });
  if (!ownerPerm) return NextResponse.json({ error: 'Only owners can invite collaborators' }, { status: 403 });

  // Find invitee by email
  const invitee = await prisma.user.findUnique({ where: { email: inviteeEmail } });
  if (!invitee) {
    return NextResponse.json({ error: `No user found with email: ${inviteeEmail}` }, { status: 404 });
  }

  // Upsert permission
  const existing = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId: invitee.id },
  });

  let permission;
  if (existing) {
    permission = await prisma.contractPermission.update({
      where: { id: existing.id },
      data: { role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  } else {
    permission = await prisma.contractPermission.create({
      data: {
        contractId: params.id,
        userId: invitee.id,
        role,
        invitedBy: ownerId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  await prisma.contractActivity.create({
    data: {
      contractId: params.id,
      userId: ownerId,
      type: 'COLLABORATOR_INVITED',
      description: `${invitee.name} invited as ${role}`,
    },
  });

  return NextResponse.json({ permission }, { status: 201 });
}
