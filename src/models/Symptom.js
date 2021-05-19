import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const schema = new Schema({
  title: String,
  patients: [{ type: Schema.Types.ObjectId, ref: 'patients' }],
});

const Symptom = model('symptoms', schema);

export default Symptom;
