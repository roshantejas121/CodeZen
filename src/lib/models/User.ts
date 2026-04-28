import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  reputation: { type: Number, default: 0 },
  stats: {
    totalSolutions: { type: Number, default: 0 },
    totalHelpfulVotes: { type: Number, default: 0 },
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
