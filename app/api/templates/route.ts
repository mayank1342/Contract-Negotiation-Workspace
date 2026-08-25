import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/templates — list templates for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const where: any = {
    userId,
    ...(search ? { name: { contains: search } } : {}),
    ...(type ? { type } : {}),
  };

  const templates = await prisma.contractTemplate.findMany({
    where,
    include: {
      variables: true,
      _count: { select: { contracts: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ templates });
}

// POST /api/templates — create a template
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, name, type, description, content, variables } = body;

  if (!userId || !name || !content) {
    return NextResponse.json({ error: 'userId, name, content required' }, { status: 400 });
  }

  // Detect template variables {{VARIABLE_NAME}} from content
  const autoDetected = Array.from(new Set(Array.from(content.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map((m: any) => m[1])));

  const varKeys = variables?.map((v: any) => v.key) || autoDetected;

  const template = await prisma.contractTemplate.create({
    data: {
      userId,
      name,
      type: type || 'General',
      description: description || '',
      content,
      variables: {
        create: varKeys.map((key: string) => {
          const provided = variables?.find((v: any) => v.key === key);
          return {
            key,
            label: provided?.label || key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            defaultVal: provided?.defaultVal || '',
          };
        }),
      },
    },
    include: { variables: true },
  });

  return NextResponse.json({ template }, { status: 201 });
}
