import express, { Router } from 'express';
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error-middleware.js';
import notFoundMiddleware from './middlewares/not-found-middleware.js';
import hospitalRouter from './routes/admin/hospital-router.js';
import cors from 'cors';
import userRouter from './routes/admin/user-router.js';
import User from './models/User.js';
import { hash } from 'bcrypt';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/hospitals', hospitalRouter);
app.use('/api/users', userRouter);

app.use(errorMiddleware);
app.use(notFoundMiddleware);

app.listen(process.env.PORT, async () => {
  console.log('Server is running on port', process.env.PORT);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: 1,
      useNewUrlParser: 1,
    });
    console.log('Succefull connection to database');

    let SuperAdmin = await User.findOne({ role: 'SUPERADMIN' }).exec();
    if (!SuperAdmin) {
      SuperAdmin = await new User({
        login: process.env.SA_LOGIN,
        password: await hash(process.env.SA_PASSWORD, 10),
        name: process.env.SA_NAME,
        role: 'SUPERADMIN',
      }).save();
    }

    console.log(SuperAdmin);
  } catch (error) {
    console.log('Database error: ', error);
    process.exit(-1);
  }
});
