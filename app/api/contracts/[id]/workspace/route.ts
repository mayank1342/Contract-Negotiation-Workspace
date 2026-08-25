import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/workspace — full contract data for workspace view
export async function GET(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      template: { select: { id: true, name: true, type: true } },
      parties: { orderBy: { order: 'asc' } },
      versions: { orderBy: { versionNumber: 'desc' } },
      permissions: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      clauses: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Check if user has any permission on this contract
  const userPermission = contract.permissions.find((p) => p.userId === userId);
  // If no userId provided or user has no permission and is not owner, block
  if (userId && !userPermission && contract.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    contract,
    userRole: userPermission?.role || (contract.userId === userId ? 'OWNER' : 'VIEWER'),
  });
}

// PUT /api/contracts/:id/workspace — update contract content + status
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, content, status, title } = body;

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId, role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.contract.update({
    where: { id: params.id },
    data: {
      ...(content !== undefined && { content }),
      ...(status && { status }),
      ...(title && { title }),
    },
  });

  if (content !== undefined) {
    await prisma.contractActivity.create({
      data: {
        contractId: params.id,
        userId,
        type: 'CONTENT_EDITED',
        description: 'Contract content edited',
      },
    });
  }

  return NextResponse.json({ contract: updated });
}
