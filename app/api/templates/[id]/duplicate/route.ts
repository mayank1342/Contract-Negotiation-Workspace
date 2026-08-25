import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

type Params = { params: { id: string } };

// POST /api/templates/:id/duplicate
export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const source = await prisma.contractTemplate.findUnique({
    where: { id: params.id },
    include: { variables: true },
  });
  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const copy = await prisma.contractTemplate.create({
    data: {
      userId,
      name: `${source.name} (Copy)`,
      type: source.type,
      description: source.description,
      content: source.content,
      fileUrl: source.fileUrl,
      fileType: source.fileType,
      variables: {
        create: source.variables.map((v) => ({
          key: v.key,
          label: v.label,
          defaultVal: v.defaultVal,
        })),
      },
    },
    include: { variables: true },
  });

  return NextResponse.json({ template: copy }, { status: 201 });
}
