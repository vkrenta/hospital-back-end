import { Router } from 'express';
import hospitalDto from '../../dto-schemas/hospital-dto.js';
import { joiHandler } from '../../helpers/errors.js';
import Hospital from '../../models/Hospital.js';

const hospitalRouter = Router();

hospitalRouter.post('/', async (req, res, next) => {
  try {
    await joiHandler(hospitalDto, req.body);
    const { id, city, title, address } = req.body;
    const hospital = await new Hospital({ id, city, title, address }).save();
    res.send(hospital);
  } catch (error) {
    next(error);
  }
});

hospitalRouter.get('/', async (req, res, next) => {
  try {
    const { page } = req.query;
    if (!page)
      res.status(400).send({ error: 'Page parameter in query is absent' });
    const hospitals = await Hospital.paginate(
      {},
      {
        limit: 10,
        page,
      }
    );
    res.send(hospitals.docs);
  } catch (error) {
    next(error);
  }
});

hospitalRouter.get('/count', async (req, res, next) => {
  try {
    const count = await Hospital.count();
    res.send({ count });
  } catch (error) {
    next(error);
  }
});

hospitalRouter.get('/names', async (req, res, next) => {
  try {
    const items = await Hospital.find({}, '_id id city title').exec();
    const names = items.map((item) => {
      return {
        hospitalId: item._id,
        text: `${item.id}, ${item.city}, ${item.title}`,
      };
    });

    res.send(names);
  } catch (error) {
    next(error);
  }
});

export default hospitalRouter;
