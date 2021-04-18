import { Router } from 'express';

const userRouter = Router();

userRouter.post('/', (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
});

export default userRouter;
