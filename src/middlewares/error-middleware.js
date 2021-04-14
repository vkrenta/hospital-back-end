import { JOI_ERROR } from '../helpers/errors.js';

export default (error, req, res, next) => {
  switch (error.type) {
    case JOI_ERROR: {
      res.status(400).send(error);
    }
  }
  console.log(error);
  res.status(500).send({ error });
};
