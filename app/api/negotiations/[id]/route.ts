import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/db/mongodb';
import NegotiationModel from '@/lib/models/Negotiation';

type Params = { params: { id: string } };

// GET /api/negotiations/:id
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const negotiation = await NegotiationModel.findById(params.id).lean();
    if (!negotiation) return NextResponse.json({ error: 'Negotiation room not found' }, { status: 404 });

    return NextResponse.json({
      negotiation: {
        id: (negotiation as any)._id.toString(),
        ...negotiation,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching negotiation' }, { status: 500 });
  }
}

// PUT /api/negotiations/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { status, overallScore, messages, offers } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (overallScore !== undefined) updateData.overallScore = overallScore;
    if (messages !== undefined) updateData.messages = messages;
    if (offers !== undefined) updateData.offers = offers;

    const updated = await NegotiationModel.findByIdAndUpdate(params.id, { $set: updateData }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Negotiation room not found' }, { status: 404 });

    return NextResponse.json({
      negotiation: {
        id: (updated as any)._id.toString(),
        ...updated,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating negotiation' }, { status: 500 });
  }
}

// DELETE /api/negotiations/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectMongoDB();
    const deleted = await NegotiationModel.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Negotiation room not found' }, { status: 404 });

    return NextResponse.json({ message: 'Negotiation deleted', id: params.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting negotiation' }, { status: 500 });
  }
}
