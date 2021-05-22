import { Router } from 'express';
import hospitalDto from '../../dto-schemas/hospital-dto.js';
import { joiHandler } from '../../helpers/errors.js';
import City from '../../models/City.js';
import Hospital from '../../models/Hospital.js';

const hospitalRouter = Router();

hospitalRouter.post('/', async (req, res, next) => {
  try {
    // await joiHandler(hospitalDto, req.body);
    const { id, city, title, address } = req.body;
    let dbCity = await City.findOne({ title: city }).exec();
    if (!dbCity) dbCity = await new City({ title: city }).save();
    const hospital = await new Hospital({
      id,
      city: dbCity,
      title,
      address,
    }).save();
    res.send(hospital);
  } catch (error) {
    res.status(201).send({ message: 'Unable to create user' });
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
        populate: 'city',
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
    const items = await Hospital.find({}).exec();
    const names = items.map((item) => {
      console.log(item);
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
