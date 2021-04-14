import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Hospital = model(
  'hospitals',
  new Schema({
    id: { type: Number, require: true, unique: true },
    city: { type: String, require: true },
    title: { type: String, require: true },
    address: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
  })
);

export default Hospital;
