/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { userRouter } from './users/users.router';
import { errorHandler } from './error/error.middleware';
import { notFoundHandler } from './error/not-found.middleware';
import { loginRouter } from './auth/auth.router';
import { postRouter } from './posts/posts.router';
import { commentRouter } from './comments/comments.router';

export const app: Application = express();
export const prisma = new PrismaClient();

//app configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
	res.send(`Server is running`);
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

app.use(errorHandler);
app.use(notFoundHandler);
