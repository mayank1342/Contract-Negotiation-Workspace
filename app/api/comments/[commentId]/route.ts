import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { commentId: string } };

// PUT /api/comments/:commentId — edit or resolve
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, content, isResolved } = body;

  const comment = await prisma.contractComment.findUnique({ where: { id: params.commentId } });
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (comment.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.contractComment.update({
    where: { id: params.commentId },
    data: {
      ...(content !== undefined && { content }),
      ...(isResolved !== undefined && { isResolved }),
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comment: updated });
}

// DELETE /api/comments/:commentId
export async function DELETE(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const comment = await prisma.contractComment.findUnique({ where: { id: params.commentId } });
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (comment.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.contractComment.delete({ where: { id: params.commentId } });
  return NextResponse.json({ success: true });
}
