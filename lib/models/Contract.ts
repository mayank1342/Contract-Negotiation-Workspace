import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClause {
  _id?: string;
  title: string;
  text: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  simpleExplanation: string;
  proExplanation: string;
  studentExplanation: string;
  whyItMatters: string;
  suggestedImprovement: string;
  negotiationStrategy: string;
  status: 'REVIEW' | 'ACCEPTED' | 'FLAGGED' | 'REWRITTEN';
  createdAt?: Date;
}

export interface IContractVersion {
  _id?: string;
  versionNumber: number;
  title: string;
  content: string;
  riskScore: number;
  changedBy: string;
  changeDescription: string;
  createdAt?: Date;
}

export interface IContract extends Document {
  userId: string;
  templateId?: string;
  sourceType: string;
  title: string;
  type: string;
  content: string;
  status: 'DRAFT' | 'ANALYZED' | 'IN_REVIEW' | 'NEGOTIATING' | 'COMPLETED';
  overallRisk: number;
  financialRisk: number;
  terminationRisk: number;
  liabilityRisk: number;
  paymentRisk: number;
  ipRisk: number;
  clauses: IClause[];
  versions: IContractVersion[];
  parties: { name: string; email?: string; company?: string; role: string; order: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const ClauseSchema = new Schema<IClause>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, default: 'General' },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    simpleExplanation: { type: String, default: '' },
    proExplanation: { type: String, default: '' },
    studentExplanation: { type: String, default: '' },
    whyItMatters: { type: String, default: '' },
    suggestedImprovement: { type: String, default: '' },
    negotiationStrategy: { type: String, default: '' },
    status: { type: String, enum: ['REVIEW', 'ACCEPTED', 'FLAGGED', 'REWRITTEN'], default: 'REVIEW' },
  },
  { timestamps: true }
);

const VersionSchema = new Schema<IContractVersion>(
  {
    versionNumber: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    riskScore: { type: Number, default: 50 },
    changedBy: { type: String, default: '' },
    changeDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

const ContractSchema = new Schema<IContract>(
  {
    userId: { type: String, required: true, index: true },
    templateId: { type: String, default: null },
    sourceType: { type: String, default: 'UPLOADED' },
    title: { type: String, required: true },
    type: { type: String, default: 'Employment Contract' },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'ANALYZED', 'IN_REVIEW', 'NEGOTIATING', 'COMPLETED'],
      default: 'DRAFT',
    },
    overallRisk: { type: Number, default: 50 },
    financialRisk: { type: Number, default: 50 },
    terminationRisk: { type: Number, default: 50 },
    liabilityRisk: { type: Number, default: 50 },
    paymentRisk: { type: Number, default: 50 },
    ipRisk: { type: Number, default: 50 },
    clauses: [ClauseSchema],
    versions: [VersionSchema],
    parties: [
      {
        name: { type: String, required: true },
        email: { type: String, default: '' },
        company: { type: String, default: '' },
        role: { type: String, default: 'Party' },
        order: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const ContractModel: Model<IContract> =
  mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);

export default ContractModel;
