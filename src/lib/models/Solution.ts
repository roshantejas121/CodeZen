import mongoose, { Schema, model, models } from 'mongoose';

const SolutionSchema = new Schema({
  problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  explanation: { type: String, default: '' },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isAccepted: { type: Boolean, default: false },
}, { timestamps: true });

const Solution = models.Solution || model('Solution', SolutionSchema);
export default Solution;
