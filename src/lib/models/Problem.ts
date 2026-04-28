import mongoose, { Schema, model, models } from 'mongoose';

const ProblemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialCode: { type: String, default: '' },
  language: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  difficulty: { type: String, enum: ['Easy', 'Intermediate', 'Advanced', 'Elite'], default: 'Intermediate' },
  tags: [{ type: String }],
  status: { type: String, enum: ['open', 'solved'], default: 'open' },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

// Create a text index for search
ProblemSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Problem = models.Problem || model('Problem', ProblemSchema);
export default Problem;
