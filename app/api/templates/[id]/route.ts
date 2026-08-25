import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/db/mongodb';
import TemplateModel from '@/lib/models/Template';

type Params = { params: { id: string } };

// GET /api/templates/:id
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const template = await TemplateModel.findById(params.id).lean();
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    return NextResponse.json({
      template: {
        id: (template as any)._id.toString(),
        ...template,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching template' }, { status: 500 });
  }
}

// PUT /api/templates/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { name, type, description, content, variables } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (variables !== undefined) updateData.variables = variables;

    const updated = await TemplateModel.findByIdAndUpdate(params.id, { $set: updateData }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    return NextResponse.json({
      template: {
        id: (updated as any)._id.toString(),
        ...updated,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating template' }, { status: 500 });
  }
}

// DELETE /api/templates/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const deleted = await TemplateModel.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    return NextResponse.json({ message: 'Template deleted', id: params.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting template' }, { status: 500 });
  }
}
