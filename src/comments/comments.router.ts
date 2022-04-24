/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import {
	createComment,
	deleteComment,
	getAllComments,
	updateComment,
} from './comments.controller';

const commentRouter = Router();

commentRouter.post('/', auth, createComment);

commentRouter.get('/', getAllComments);

commentRouter.put('/:id', auth, updateComment);

commentRouter.delete('/:id', auth, deleteComment);

export { commentRouter };
