import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplateVariable {
  _id?: string;
  key: string;
  label: string;
  defaultVal?: string;
}

export interface IContractTemplate extends Document {
  userId: string;
  name: string;
  type: string;
  description: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  isPublic: boolean;
  variables: ITemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

const TemplateVariableSchema = new Schema<ITemplateVariable>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    defaultVal: { type: String, default: '' },
  },
  { timestamps: true }
);

const ContractTemplateSchema = new Schema<IContractTemplate>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, default: 'General' },
    description: { type: String, default: '' },
    content: { type: String, required: true },
    fileUrl: { type: String, default: null },
    fileType: { type: String, default: null },
    isPublic: { type: Boolean, default: false },
    variables: [TemplateVariableSchema],
  },
  { timestamps: true }
);

export const TemplateModel: Model<IContractTemplate> =
  mongoose.models.ContractTemplate ||
  mongoose.model<IContractTemplate>('ContractTemplate', ContractTemplateSchema);

export default TemplateModel;
