import Joi from 'joi';

export default Joi.object({
  login: Joi.required(),
  name: Joi.string().required(),
  // hospitalId: Joi.string(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
