import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { model, Schema } = mongoose;

const schema = new Schema({
  hospital: { type: Schema.Types.ObjectId, ref: 'hospitals' },
  name: { type: String, require: true },
  gender: { type: Number, require: true },
  age: { type: Number },
  condition: {
    type: String,
    enum: ['Задовільний', 'Середньої тяжкості', 'Тяжкий', 'Надміру тяжкий'],
  },
  symptoms: [{ type: Schema.Types.ObjectId, ref: 'symptoms' }],
  diagnose: { type: Schema.Types.ObjectId, ref: 'diagnoses' },
  pressure: String,
  temperature: String,
  result: {
    type: String,
    enum: ['На утриманні', 'Одужання', 'Летальний випадок'],
  },
  description: String,
  hospitalizedAt: Date,
  resultAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  consolidetAt: Date,
});

schema.plugin(mongoosePaginate);

const Patient = model('patients', schema);

export default Patient;
