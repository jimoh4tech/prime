/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';

import {
	registerUser,
	getAllUser,
	getUserById,
	updateUser,
	deleteUser,
} from './users.controller';

const userRouter = Router();

userRouter.post('/', registerUser);

userRouter.get('/', getAllUser);

userRouter.get('/:id', getUserById);


userRouter.put('/:id', auth, updateUser);

userRouter.delete('/:id', auth, deleteUser);

export { userRouter };
