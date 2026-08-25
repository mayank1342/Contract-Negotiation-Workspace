import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  xp: number;
  level: number;
  currentStreak: number;
  completedLessons: string[];
  completedQuizzes: string[];
  badges: { badgeKey: string; title: string; description: string; icon: string; unlockedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    currentStreak: { type: Number, default: 1 },
    completedLessons: [{ type: String }],
    completedQuizzes: [{ type: String }],
    badges: [
      {
        badgeKey: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Trophy' },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const UserProgressModel: Model<IUserProgress> =
  mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgressModel;
