import { genSalt, hash, compare } from 'bcrypt';
import { Router } from 'express';
import userDto from '../../dto-schemas/user-dto.js';
import { joiHandler } from '../../helpers/errors.js';
import Hospital from '../../models/Hospital.js';
import User from '../../models/User.js';

const userRouter = Router();

userRouter.post('/', async (req, res, next) => {
  try {
    // await joiHandler(userDto, req.body);
    const { login, name, hospitalId, password, role } = req.body;

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const hospital = await Hospital.findById(hospitalId).exec();

    const user = await new User({
      login,
      name,
      password: hashPassword,
      hospitalId: hospital,
      role,
    });

    await user.save();

    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const { page } = req.query;
    if (!page)
      return res
        .status(400)
        .send({ error: 'Page parameter in query is absent' });
    const users = await User.paginate(
      {},
      {
        populate: 'hospitalId',
        limit: 10,
        page,
      }
    );
    res.send(users.docs);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/count', async (req, res, next) => {
  try {
    const count = await User.count();
    res.send({ count });
  } catch (error) {
    next(error);
  }
});

userRouter.post('/getUserByCredentials', async (req, res, next) => {
  try {
    const user = await User.findOne({ login: req.body.login }).exec();
    console.log(req.body);
    await compare(req.body.password, user.password);
    res.send(user);
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ message: 'Неправильний пароль користувача або логін' });
  }
});

export default userRouter;
