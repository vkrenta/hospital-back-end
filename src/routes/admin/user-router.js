import { genSalt, hash } from 'bcrypt';
import { Router } from 'express';
import userDto from '../../dto-schemas/user-dto.js';
import { joiHandler } from '../../helpers/errors.js';
import User from '../../models/User.js';

const userRouter = Router();

userRouter.post('/', async (req, res, next) => {
  try {
    await joiHandler(userDto, req.body);
    const { login, name, hospitalId, password, role } = req.body;

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const user = await new User({
      login,
      name,
      hospitalId,
      password: hashPassword,
      role,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
