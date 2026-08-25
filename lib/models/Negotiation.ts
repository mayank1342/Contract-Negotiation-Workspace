import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INegotiationMessage {
  _id?: string;
  sender: 'USER' | 'OPPONENT' | 'SYSTEM' | 'COACH';
  text: string;
  roundNumber: number;
  createdAt?: Date;
}

export interface IOffer {
  _id?: string;
  roundNumber: number;
  offerBy: 'USER' | 'OPPONENT';
  salary: number;
  duration?: string;
  noticePeriod?: string;
  paymentTerms?: string;
  status: 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED';
}

export interface INegotiation extends Document {
  contractId?: string;
  userId: string;
  title: string;
  opponentRole: string;
  opponentStyle: string;
  userRole: string;
  goal: string;
  targetValue: number;
  minimumValue: number;
  batnaValue: number;
  zopaMin: number;
  zopaMax: number;
  status: 'ACTIVE' | 'AGREED' | 'FAILED';
  overallScore?: number;
  messages: INegotiationMessage[];
  offers: IOffer[];
  createdAt: Date;
  updatedAt: Date;
}

const NegotiationMessageSchema = new Schema<INegotiationMessage>(
  {
    sender: { type: String, enum: ['USER', 'OPPONENT', 'SYSTEM', 'COACH'], required: true },
    text: { type: String, required: true },
    roundNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const OfferSchema = new Schema<IOffer>(
  {
    roundNumber: { type: Number, required: true },
    offerBy: { type: String, enum: ['USER', 'OPPONENT'], required: true },
    salary: { type: Number, required: true },
    duration: { type: String, default: '1 Year' },
    noticePeriod: { type: String, default: '30 Days' },
    paymentTerms: { type: String, default: '30 Days' },
    status: { type: String, enum: ['PENDING', 'COUNTERED', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  },
  { timestamps: true }
);

const NegotiationSchema = new Schema<INegotiation>(
  {
    contractId: { type: String, default: null },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    opponentRole: { type: String, default: 'HR Manager' },
    opponentStyle: { type: String, default: 'Professional' },
    userRole: { type: String, default: 'Candidate' },
    goal: { type: String, default: 'Maximize total package & fair terms' },
    targetValue: { type: Number, default: 75000 },
    minimumValue: { type: Number, default: 65000 },
    batnaValue: { type: Number, default: 68000 },
    zopaMin: { type: Number, default: 65000 },
    zopaMax: { type: Number, default: 85000 },
    status: { type: String, enum: ['ACTIVE', 'AGREED', 'FAILED'], default: 'ACTIVE' },
    overallScore: { type: Number, default: 80 },
    messages: [NegotiationMessageSchema],
    offers: [OfferSchema],
  },
  { timestamps: true }
);

export const NegotiationModel: Model<INegotiation> =
  mongoose.models.Negotiation || mongoose.model<INegotiation>('Negotiation', NegotiationSchema);

export default NegotiationModel;
