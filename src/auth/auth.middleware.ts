/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/users.interface';
import { prisma } from '../app';
import { getDecodedToken } from './auth.util';

const auth = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const decodedToken = getDecodedToken(String(req.headers.authorization));
		const user: User | null = await prisma.user.findUnique({
			where: {
				email: decodedToken.email,
			},
			select: {
				id: true,
				username: true,
				email: true,
				password: true
			},
		});
		if (user) {
			req.currentUser = user;
		} else {
			throw new Error("User not found");
			
		}
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export { auth };
