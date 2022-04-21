/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import { toNewUser, throwError } from './users.utils';
import { prisma } from '../app';

const registerUser = async (req: Request, res: Response) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = toNewUser(req.body);
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
		res.status(400).json({
			success: false,
			message: throwError(error),
		});
	}
};

const getAllUser = async (_req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				username: true,
				email: true,
			},
		});
		res.status(200).json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (error: unknown) {
		res.status(400).json({
			success: false,
			message: throwError(error),
		});
	}
};

export { registerUser, getAllUser };
