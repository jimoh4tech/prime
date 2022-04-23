/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { throwError } from '../users/users.utils';
import { prisma } from '../app';
import { User } from '../users/users.interface';

const login = async (req: Request, res: Response) => {
	try {
		const { email, username, password } = req.body;
		let user: User | null;
		if (email) {
			user = await prisma.user.findUnique({
				where: {
					email,
				},
				select: {
					id: true,
					username: true,
					email: true,
					password: true
				},
			});
		} else {
			user = await prisma.user.findUnique({
				where: {
					username,
				},
				select: {
					id: true,
					username: true,
					email: true,
					password: true
				},
			});
		}
		
		const passwordCorrect =
			user === null ? false : await compare(password, user.password);
		if (!user || !passwordCorrect) {
			res.status(401).json({ error: 'Invalid email or password' });
		}

		const userForToken = {
			email: user?.email,
			id: user?.id,
		};
		const secret: string = process.env.SECRET || 'test-environent';

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const token = sign(userForToken, secret, { expiresIn: '2h' });

		res.status(200).json({
			success: true,
			token,
			email: user?.email,
			id: user?.id,
		});
	} catch (error: unknown) {
		res.status(400).json(throwError(error));
	}
};


export { login };
