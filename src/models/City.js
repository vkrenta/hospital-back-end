import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const schema = new Schema({
  title: String,
  hospitals: [{ type: Schema.Types.ObjectId, ref: 'hospitals' }],
});

const City = model('cities', schema);

export default City;
