/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Response, Request } from 'express';
import { prisma } from '../app';
import { parseContent } from '../posts/posts.utils';
import { throwError } from '../users/users.utils';

const createComment = async (req: Request, res: Response) => {
	try {
		const content = parseContent(req.body.content);
		const user = req.currentUser;
    if (!user) throw new Error('User is undefined');
		const comment = await prisma.comment.create({
      data: {
        postId: Number(req.body.postId),
				content,
        userId: user.id
			},
		});
		res.status(201).json({
			success: true,
			data: comment
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const getAllComments = async (_req: Request, res: Response) => {
	try {
		const comments = await prisma.comment.findMany({});
		res.status(200).json({
			success: true,
			count: comments.length,
			data: comments,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const updateComment = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const currentUser = req.currentUser;

		const comment = await prisma.comment.findUnique({
			where: { id: Number(id) },
			select: {
				userId: true,
			},
		});

		if (!comment) throw new Error('comment not found');
		if (currentUser?.id !== comment.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to update this comment',
			});
		}
		await prisma.comment.update({
			where: { id: Number(id) },
			data: {
				content: parseContent(req.body.content),
			},
		});

		const upadatedComment = await prisma.comment.findUnique({
			where: { id: Number(id) }
		});

		res.status(200).json({
			success: true,
			data: upadatedComment,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const deleteComment = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const currentUser = req.currentUser;

		const comment = await prisma.comment.findUnique({
			where: { id: Number(id) },
			select: {
				userId: true,
			},
		});

		if (!comment) throw new Error('comment not found');
		if (currentUser?.id !== comment.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to update this comment',
			});
		}
		await prisma.comment.delete({
			where: { id: Number(id) },
		});

		res.status(204).end();
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};
export { createComment, getAllComments, updateComment, deleteComment };
