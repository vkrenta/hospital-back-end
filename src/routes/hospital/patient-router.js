import { Router } from 'express';
import Diagnose from '../../models/Diagnose.js';
import Hospital from '../../models/Hospital.js';
import Patient from '../../models/Patient.js';
import Symptom from '../../models/Symptom.js';

const patientRouter = Router();

patientRouter.get('/diagnosis', async (req, res, next) => {
  try {
    const diagnosis = await Diagnose.find().exec();
    res.send(diagnosis.map((d) => d.title));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

patientRouter.get('/symptoms', async (req, res, next) => {
  try {
    const symptoms = await Symptom.find().exec();
    res.send(symptoms.map((d) => d.title));
  } catch (error) {
    next(error);
  }
});

patientRouter.get('/id=:id', async (req, res, next) => {
  try {
    if (!id) {
      const patient = await Patient.findById(req.patientId);
      res.send(patient);
    } else {
      const patients = await Patient.find();
      res.send(patients);
    }
  } catch (error) {
    next(error);
  }
});

patientRouter.post('/', async (req, res, next) => {
  try {
    const {
      hospitalId,
      name,
      gender,
      age,
      condition,
      symptomIds,
      diagnoseId,
      pressure,
      temperature,
      result,
      description,
      hospitalizedAt,
      resultAt,
    } = req;
    const hospital = await Hospital.findById(hospitalId);
    const symptoms = await Promise.all(
      symptomIds.map((id) => {
        return Symptom.findOne({ title: id });
      })
    );
    const diagnose = await Diagnose.findOne({ title: diagnoseId });
    const patient = await new Patient({
      hospital,
      name,
      age,
      gender,
      condition,
      symptoms,
      diagnose,
      pressure,
      temperature,
      result,
      resultAt,
      description,
      hospitalizedAt,
    });
    res.send(patient);
  } catch (e) {
    next(e);
  }
});

// patientRouter.put();

// patientRouter.delete();

export default patientRouter;
