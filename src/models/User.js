import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { model, Schema } = mongoose;

const schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'hospitals' },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

schema.plugin(mongoosePaginate);

export default model('users', schema);
