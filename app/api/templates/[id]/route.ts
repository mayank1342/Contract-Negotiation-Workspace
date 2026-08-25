import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// GET /api/templates/:id
export async function GET(req: NextRequest, { params }: Params) {
  const template = await prisma.contractTemplate.findUnique({
    where: { id: params.id },
    include: {
      variables: true,
      _count: { select: { contracts: true } },
    },
  });
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ template });
}

// PUT /api/templates/:id
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId, name, type, description, content, variables } = body;

  const existing = await prisma.contractTemplate.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (existing.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Re-detect variables
  const autoDetected = content
    ? Array.from(new Set(Array.from(content.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map((m: any) => m[1])))
    : [];


  const template = await prisma.contractTemplate.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(type && { type }),
      ...(description !== undefined && { description }),
      ...(content && {
        content,
        variables: {
          deleteMany: {},
          create: autoDetected.map((key: string) => {
            const provided = variables?.find((v: any) => v.key === key);
            return {
              key,
              label: provided?.label || key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
              defaultVal: provided?.defaultVal || '',
            };
          }),
        },
      }),
    },
    include: { variables: true },
  });

  return NextResponse.json({ template });
}

// DELETE /api/templates/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const existing = await prisma.contractTemplate.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (existing.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.contractTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
