import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectMongoDB from '@/lib/db/mongodb';
import TemplateModel from '@/lib/models/Template';
import { getSessionUser } from '@/lib/auth';

const FALLBACK_USER_ID = 'demo-user-1';

// GET /api/templates — List templates
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || searchParams.get('userId') || FALLBACK_USER_ID;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const filter: any = { userId };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (type && type !== 'All Types') filter.type = type;

    const templates = await TemplateModel.find(filter).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({
      templates: templates.map((t: any) => ({
        id: t._id.toString(),
        name: t.name,
        type: t.type,
        description: t.description,
        content: t.content,
        fileUrl: t.fileUrl,
        fileType: t.fileType,
        isPublic: t.isPublic,
        variables: t.variables || [],
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/templates error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST /api/templates — Create template
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const sessionUser = await getSessionUser();
    const userId = sessionUser?.id || body.userId || FALLBACK_USER_ID;

    const { name, type, description, content, variables } = body;
    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const autoVars = Array.from(new Set(Array.from(content.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map((m: any) => m[1])));
    const formattedVariables = (variables || autoVars.map((k) => ({ key: k, label: k }))).map((v: any) => ({
      key: v.key,
      label: v.label || v.key,
      defaultVal: v.defaultVal || '',
    }));

    const template = await TemplateModel.create({
      userId,
      name,
      type: type || 'General',
      description: description || '',
      content,
      variables: formattedVariables,
    });

    return NextResponse.json(
      {
        template: {
          id: template._id.toString(),
          ...template.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create template' }, { status: 500 });
  }
}
