/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { prisma } from '../app';
import { throwError } from '../users/users.utils';
import { toNewPost } from './posts.utils';

const createPost = async (req: Request, res: Response) => {
	try {
		const newPost = toNewPost(req.body);
		const user = req.currentUser;
		if (!user) throw new Error("User is undefined");
		
		const post = await prisma.post.create({
			data: {
				...newPost,
				userId: user.id,
			},
		});

		res.status(201).json({
			success: true,
			data: post
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const getAllPosts = async (_req: Request, res: Response) => {
	try {
		const posts = await prisma.post.findMany({});
		res.status(200).json({
			success: true,
			count: posts.length,
			data: posts,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const getPostById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await prisma.post.findUnique({
			where: { id: Number(id) },
		});

		res.status(200).json({
			success: true,
			data: post,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const likePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await prisma.post.findUnique({
			where: { id: Number(id) },
			select: {
				id: true,
				content: true,
				likes: true,
			},
		});

		if (!post) throw new Error('Post not found');

		await prisma.post.update({
			where: {
				id: Number(id),
			},
			data: {
				likes: post.likes + 1,
			},
		});

		const upadatedPost = await prisma.post.findUnique({
			where: { id: Number(id) },
		});

		res.status(200).json({
			success: true,
			data: upadatedPost,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const updateMyPost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const currentUser = req.currentUser;

		const post = await prisma.post.findUnique({
			where: { id: Number(id) },
			select: {
				userId: true,
			},
		});

		if (!post) throw new Error('Post not found');

		if (currentUser?.id !== post.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to update this post',
			});
		}
		await prisma.post.update({
			where: { id: Number(id) },
			data: {
				...req.body,
			},
		});

		const upadatedPost = await prisma.post.findUnique({
			where: { id: Number(id) },
		});

		res.status(200).json({
			success: true,
			data: upadatedPost,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const deletePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const currentUser = req.currentUser;

		const post = await prisma.post.findUnique({
			where: { id: Number(id) },
			select: {
				userId: true,
			},
		});

		if (!post) throw new Error('Post not found');

		if (currentUser?.id !== post.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to update this post',
			});
		}

		await prisma.post.delete({
			where: { id: Number(id) },
		});

		res.status(204).end();
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

export {
	createPost,
	getAllPosts,
	getPostById,
	likePost,
	updateMyPost,
	deletePost,
};
