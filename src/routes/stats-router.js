import { Router } from 'express';
import Diagnose from '../models/Diagnose.js';
import Hospital from '../models/Hospital.js';
import Patient from '../models/Patient.js';
import Symptom from '../models/Symptom.js';
const statsRouter = Router();

statsRouter.get('/', async (req, res, next) => {
  try {
    const hospitals = await Hospital.count().exec();
    const hospitalizations = await Patient.count().exec();
    const recoveries = await Patient.count()
      .where({ result: 'Одужання' })
      .exec();
    const deads = await Patient.count()
      .where({ result: 'Летальний випадок' })
      .exec();
    const busyBeds = await Patient.count()
      .where({ result: 'На утриманні' })
      .exec();
    const h = await Hospital.find().exec();
    let totalBeds = 0;
    h.forEach((t) => {
      totalBeds += t.totalBeds;
    });

    const periods = [];
    periods[8] = new Date();
    for (let i = 7; i >= 0; i--) {
      periods[i] = new Date(periods[i + 1] - 86400000);
    }

    const recoverySeries = [];
    const deadSeries = [];
    const hospitalizationSeries = [];

    for (let i = 0; i < 8; i++) {
      recoverySeries[i] = await Patient.count()
        .where({
          result: 'Одужання',
          createdAt: { $gte: periods[i], $lte: periods[i + 1] },
        })
        .exec();
      deadSeries[i] = await Patient.count()
        .where({
          result: 'Летальний випадок',
          createdAt: { $gte: periods[i], $lte: periods[i + 1] },
        })
        .exec();
      hospitalizationSeries[i] = await Patient.count()
        .where({ createdAt: { $gte: periods[i], $lte: periods[i + 1] } })
        .exec();
    }

    res.send({
      hospitals,
      hospitalizations,
      recoveries,
      busyBeds,
      totalBeds,
      deads,
      periods,
      recoverySeries,
      deadSeries,
      hospitalizationSeries,
    });
  } catch (error) {
    next(error);
  }
});

export default statsRouter;
