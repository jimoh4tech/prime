/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	likePost,
	updateMyPost,
} from './posts.controller';

const postRouter = Router();

postRouter.post('/', auth, createPost);

postRouter.get('/', getAllPosts);

postRouter.get('/:id', getPostById);

postRouter.put('/:id', auth, updateMyPost);

postRouter.put('/:id/likes', likePost);

postRouter.delete('/:id', auth, deletePost);

export { postRouter };
