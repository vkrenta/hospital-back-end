import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { model, Schema } = mongoose;

const schema = new Schema({
  id: { type: Number, require: true, unique: true },
  city: { type: String, require: true },
  title: { type: String, require: true },
  address: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

schema.plugin(mongoosePaginate);

const Hospital = model('hospitals', schema);

export default Hospital;
