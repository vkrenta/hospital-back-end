import express, { Router } from 'express';
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error-middleware.js';
import notFoundMiddleware from './middlewares/not-found-middleware.js';
import hospitalRouter from './routes/admin/hospital-router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/hospitals', hospitalRouter);

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
  } catch (error) {
    console.log('Database error: ', error);
    process.exit(-1);
  }
});
