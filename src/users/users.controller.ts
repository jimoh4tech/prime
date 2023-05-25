/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import { toNewUser, throwError, parsePassword } from './users.utils';
import { prisma } from '../app';

const registerUser = async (req: Request, res: Response) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = toNewUser(req.body);

		const existingUser = await prisma.user.findUnique({
			select: {
				email: true,
			},
			where: {
				email: newUser.email,
			},
		});

		if (existingUser) return res.status(403).send('User already registered!');
		newUser.password = await hash(newUser.password, 10);
		const user = await prisma.user.create({
			data: {
				...newUser,
			},
			select: {
				email: true,
				username: true,
			},
		});
		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const getAllUser = async (_req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		res.status(200).json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				id: true,
				username: true,
				email: true,
			},
		});
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const password = parsePassword(req.body.password);
		const currentUser = req.currentUser;
		if (currentUser?.id !== Number(id)) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to update this profile',
			});
		}
		const hashPassword = await hash(password, 10);

		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				password: hashPassword,
			},
		});

		if (user) {
			const updatedUser = await prisma.user.findUnique({
				where: {
					id: Number(id),
				},
				select: {
					username: true,
					email: true,
				},
			});
			return res.status(200).json({
				success: true,
				data: updatedUser,
			});
		}
		throw new Error('User not found');
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const currentUser = req.currentUser;
		if (currentUser?.id !== Number(id)) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to delete this profile',
			});
		}

		const deleted = await prisma.user.delete({
			where: {
				id: Number(id),
			},
		});

		if (deleted) {
			return res.status(204).end();
		}
		throw new Error('User not found');
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};
export { registerUser, getAllUser, getUserById, updateUser, deleteUser };
