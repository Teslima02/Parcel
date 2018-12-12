import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const Account = new Schema({
  googleId: String,
  name: String,
  password: String,
  username: { type: String },
  email: { type: String, index: { unique: true } },
  phone: Number,
  dob: Date,
  roleId: { type: String, lowercase: true, trim: true,
            enum: ['admin', 'animator'] },
  address: String,
  gender: String,
  image: String,
  country: String,
  state: String,
  lga: String,
  token: String,
  termsAndCondition: Boolean,
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

Account.plugin(passportLocalMongoose);

export default mongoose.model('accounts', Account);
