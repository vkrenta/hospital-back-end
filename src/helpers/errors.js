export const VALIDATION_SCHEMA_ERROR = 'VALIDATION_SCHEMA_ERROR';

export const joiHandler = async (dto, body) => {
  try {
    await dto.validateAsync(body, { abortEarly: false });
  } catch (error) {
    const message = error.details;
    const err = new Error();
    err.type = 'VALIDATION_SCHEMA_ERROR';
    err.message = message;
    err.status = 400;
    throw err;
  }
};
