import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  experience: string;
  preferredStyle: string;
  mainGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: '' },
    name: { type: String, required: true },
    role: { type: String, default: 'Freelancer' },
    experience: { type: String, default: 'Intermediate' },
    preferredStyle: { type: String, default: 'Professional' },
    mainGoal: { type: String, default: 'Better contract value & lower risk' },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
