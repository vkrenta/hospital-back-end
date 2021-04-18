import Joi from 'joi';

export default Joi.object({
  id: Joi.number().required().min(100000).max(999999),
  name: Joi.string().required(),
  hospitalId: Joi.number().required().min(100000).max(999999),
  password: Joi.string().required,
  role: [Joi.equal('SUPERADMIN'), Joi.equal('HOSPITAL_ADMIN')],
});
