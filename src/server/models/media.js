import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Media = new Schema({
  _createdBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
  _subCategoryId: { type: Schema.Types.ObjectId, ref: 'subcategories' },
  media: String,
  fileSize: Number,
  fileType: String,
  title: String,
  price: Number,
  type: String,
  forWho: String,
  description: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('medias', Media);
