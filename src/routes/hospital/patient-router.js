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

// patientRouter.get('/id=:id', async (req, res, next) => {
//   try {
//     if (!id) {
//       const patient = await Patient.findById(req.patientId);
//       res.send(patient);
//     } else {
//       const patients = await Patient.find();
//       res.send(patients);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

patientRouter.get('/:hospitalId', async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).exec();
    const patients = await Patient.find({ hospital })
      .populate('symptoms')
      .populate('diagnose')
      .exec();
    res.send(patients);
  } catch (error) {
    next(error);
  }
});

patientRouter.post('/csv', async (req, res, next) => {
  try {
    const csv = (await import('csv-parser')).default;
    const fs = await import('fs');
    const report = {
      total: 0,
      accepted: 0,
      rejected: 0,
    };

    const hospital = await Hospital.findById(req.body.HospitalId).exec();

    fs.createReadStream(req.body.CSV.path)
      .pipe(csv({}))
      .on('data', async (data) => {
        report.total++;
        try {
          data.hospital = hospital;
          data.gender =
            data.gender === 'Чоловіча' || data.gender === '1' ? 1 : 2;

          const symptomNames = data.symptoms.split(';');
          data.symptoms = [];
          await Promise.all(
            symptomNames.map(async (element) => {
              let symptom = await Symptom.findOne({ title: element }).exec();
              if (!symptom)
                symptom = await new Symptom({ title: element }).save();
              data.symptoms.push(symptom);
            })
          );

          const diagnose = await Diagnose.findOne({
            title: data.diagnose,
          }).exec();
          if (!diagnose)
            diagnose = await new Diagnose({ title: data.diagnose }).save();
          data.diagnose = diagnose;

          data.hospitalizedAt = new Date(
            data.hospitalizedAt
              .split('.')
              .map((_, i) => {
                if (i === 1) return Number(_) + 1;
                return _;
              })
              .reverse()
          );
          data.resultAt = new Date(
            data.resultAt
              .split('.')
              .map((_, i) => {
                if (i === 1) return Number(_) + 1;
                return _;
              })
              .reverse()
          );
          data.consolidetAt = new Date();

          await new Patient(data).save();
          report.accepted++;
        } catch (error) {
          report.rejected++;
          console.log(error);
        }
      })
      .on('end', () => {
        res.send('Done');
      });
    // console.log(req.body.csv.path);
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
    } = req.body;
    const hospital = await Hospital.findById(hospitalId).exec();
    const symptoms = await Promise.all(
      symptomIds.map((id) => {
        return Symptom.findOne({ title: id }).exec();
      })
    );
    const diagnose = await Diagnose.findOne({ title: diagnoseId }).exec();
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
    }).save();
    res.send(patient);
  } catch (e) {
    next(e);
  }
});

// patientRouter.put();

// patientRouter.delete();

export default patientRouter;
