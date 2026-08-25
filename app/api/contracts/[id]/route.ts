import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/db/mongodb';
import ContractModel from '@/lib/models/Contract';
import { getSessionUser } from '@/lib/auth';

type Params = { params: { id: string } };

// GET /api/contracts/:id — Read single contract
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const contract = await ContractModel.findById(params.id).lean();

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({
      contract: {
        id: (contract as any)._id.toString(),
        ...contract,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching contract' }, { status: 500 });
  }
}

// PUT /api/contracts/:id — Update contract
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { title, type, content, status, overallRisk, clauses } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;
    if (overallRisk !== undefined) updateData.overallRisk = overallRisk;
    if (clauses !== undefined) updateData.clauses = clauses;

    const updated = await ContractModel.findByIdAndUpdate(params.id, { $set: updateData }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({
      contract: {
        id: (updated as any)._id.toString(),
        ...updated,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating contract' }, { status: 500 });
  }
}

// DELETE /api/contracts/:id — Delete contract
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const deleted = await ContractModel.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contract deleted successfully', id: params.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting contract' }, { status: 500 });
  }
}
