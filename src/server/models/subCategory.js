import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubCategory = new Schema({
  _createdBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
  _categoryId: { type: Schema.Types.ObjectId, ref: 'categories' },
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('subcategories', SubCategory);
