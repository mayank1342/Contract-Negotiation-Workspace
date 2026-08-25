import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/versions
export async function GET(req: NextRequest, { params }: Params) {
  const versions = await prisma.contractVersion.findMany({
    where: { contractId: params.id },
    orderBy: { versionNumber: 'desc' },
  });
  return NextResponse.json({ versions });
}

// POST /api/contracts/:id/versions — create a snapshot version
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, changeDescription, newContent } = body;

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId, role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  const lastVersion = await prisma.contractVersion.findFirst({
    where: { contractId: params.id },
    orderBy: { versionNumber: 'desc' },
  });

  const nextVersionNumber = (lastVersion?.versionNumber || 0) + 1;

  const version = await prisma.contractVersion.create({
    data: {
      contractId: params.id,
      versionNumber: nextVersionNumber,
      title: `v${nextVersionNumber} — ${changeDescription || 'Manual save'}`,
      content: newContent || contract.content,
      changedBy: contract.user.name,
      changeDescription: changeDescription || 'Manual save',
    },
  });

  // If newContent provided, update the contract
  if (newContent) {
    await prisma.contract.update({
      where: { id: params.id },
      data: { content: newContent, updatedAt: new Date() },
    });
  }

  await prisma.contractActivity.create({
    data: {
      contractId: params.id,
      userId,
      type: 'VERSION_CREATED',
      description: `Version v${nextVersionNumber} created: ${changeDescription || 'Manual save'}`,
    },
  });

  return NextResponse.json({ version }, { status: 201 });
}
