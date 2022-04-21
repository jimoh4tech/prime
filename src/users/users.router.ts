/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

import { registerUser, getAllUser } from './users.controller';

const userRouter = Router();

userRouter.post('/', registerUser);

userRouter.get('/', getAllUser);

export { userRouter };
