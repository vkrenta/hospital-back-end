export const JOI_ERROR = 'JOI_ERROR';

export const joiHandler = async (dto, body) => {
  try {
    await dto.validateAsync(body);
  } catch (error) {
    const message = error.details[0].message;
    const err = new Error();
    err.type = 'JOI_ERROR';
    err.message = message;
    throw err;
  }
};
