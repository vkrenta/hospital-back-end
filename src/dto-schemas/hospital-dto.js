import Joi from 'joi';

export default Joi.object({
  id: Joi.number().integer().min(100000).max(999999).required(),
  city: Joi.string().required(),
  title: Joi.string().required(),
  address: Joi.string().required(),
});
