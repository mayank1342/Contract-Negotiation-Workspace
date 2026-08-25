import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string; versionId: string } };

// POST /api/contracts/:id/restore/:versionId
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const permission = await prisma.contractPermission.findFirst({
    where: { contractId: params.id, userId, role: { in: ['OWNER', 'EDITOR'] } },
  });
  if (!permission) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const targetVersion = await prisma.contractVersion.findUnique({
    where: { id: params.versionId },
  });
  if (!targetVersion) return NextResponse.json({ error: 'Version not found' }, { status: 404 });

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  // Create a new version from the restored content
  const lastVersion = await prisma.contractVersion.findFirst({
    where: { contractId: params.id },
    orderBy: { versionNumber: 'desc' },
  });
  const nextVersionNumber = (lastVersion?.versionNumber || 0) + 1;

  const restoredVersion = await prisma.contractVersion.create({
    data: {
      contractId: params.id,
      versionNumber: nextVersionNumber,
      title: `v${nextVersionNumber} — Restored from v${targetVersion.versionNumber}`,
      content: targetVersion.content,
      changedBy: contract.user.name,
      changeDescription: `Restored to v${targetVersion.versionNumber}: ${targetVersion.title}`,
    },
  });

  // Update contract content to restored version
  await prisma.contract.update({
    where: { id: params.id },
    data: { content: targetVersion.content },
  });

  await prisma.contractActivity.create({
    data: {
      contractId: params.id,
      userId,
      type: 'VERSION_CREATED',
      description: `Content restored to v${targetVersion.versionNumber} (${targetVersion.title})`,
    },
  });

  return NextResponse.json({ version: restoredVersion, restoredContent: targetVersion.content });
}
