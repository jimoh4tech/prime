/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import supertest from 'supertest';
import { app, prisma } from '../app';

const api = supertest(app);

beforeAll(async () => {
	await prisma.comment.deleteMany({});
	await prisma.post.deleteMany({});
	await prisma.user.deleteMany({});
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe('User API', () => {
	const newUser = {
		username: 'emeka',
		email: 'emeka@gmail.com',
		password: '123456',
	};
	it('GET / => Can get the default url', async () => {
		await api.get('/').expect(200).expect('Server is running');
	});

	it('POST /api/v1/users => can register new user', async () => {
		const user = await api
			.post('/api/v1/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(user.body.success).toBe(true);
		expect(user.body.data.username).toContain('emeka');
		expect(user.body.data.email).toContain('emeka@gmail.com');
	});

	it('GET /api/v1/users => get all users', async () => {
		const users = await api
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(users.body.success).toBe(true);
		expect(users.body.count).toBe(1);
		expect(users.body.data).toBeDefined();
	});

	describe('Login API', () => {
		it('POST /api/v1/login => user can login', async () => {
			const login = await api.post('/api/v1/login').send(newUser).expect(200);
			expect(login.body.token).toBeDefined();
			expect(login.body.email).toContain(newUser.email);
		});

		it('PUT /api/v1/users/:id => user can update their passwords', async () => {
			const usersAtStart = await api.get('/api/v1/users');
			const user = usersAtStart.body.data[0];
			const login = await api.post('/api/v1/login').send(newUser).expect(200);
			await api
				.put(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${login.body.token}`)
				.send({ password: '654321' })
				.expect(200)
				.expect('Content-Type', /application\/json/);
		});

		it('DELETE /api/v1/users/:id => user can delete their account', async () => {
			const usersAtStart = await api.get('/api/v1/users');
			const user = usersAtStart.body.data[0];
			const login = await api
				.post('/api/v1/login')
				.send({ email: 'emeka@gmail.com', password: '654321' })
				.expect(200);
			await api
				.delete(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${login.body.token}`)
				.expect(204);
		});
	});
});
