import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Category = new Schema({
  _createdBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('categories', Category);
