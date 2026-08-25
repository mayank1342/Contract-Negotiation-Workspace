import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/contracts/:id/comments
export async function GET(req: NextRequest, { params }: Params) {
  const comments = await prisma.contractComment.findMany({
    where: { contractId: params.id, parentId: null },
    include: {
      user: { select: { id: true, name: true, email: true } },
      replies: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ comments });
}

// POST /api/contracts/:id/comments
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, content, clauseRef, parentId } = body;

  if (!userId || !content) return NextResponse.json({ error: 'userId and content required' }, { status: 400 });

  const comment = await prisma.contractComment.create({
    data: {
      contractId: params.id,
      userId,
      content,
      clauseRef: clauseRef || '',
      parentId: parentId || null,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.contractActivity.create({
    data: {
      contractId: params.id,
      userId,
      type: 'COMMENT_ADDED',
      description: parentId ? 'Reply added to comment' : `Comment added${clauseRef ? ` on "${clauseRef}"` : ''}`,
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
