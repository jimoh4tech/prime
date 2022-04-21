import supertest from 'supertest';
import { app, prisma } from '../app';

const api = supertest(app);

beforeAll(async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	await prisma.user.deleteMany({});
});

afterAll(async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	await prisma.$disconnect();
});

describe('User API', () => {
	it('GET / => Can get the default url', async () => {
		await api.get('/').expect(200).expect('Server is running');
	});

	it('POST /api/users => can register new user', async () => {
		const newUser = {
			username: 'emeka1',
			email: 'emeka@gmail.com',
			password: '123456',
		};

		const user = await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(user.body.success).toBe(true);
		expect(user.body.data.username).toContain('emeka1');
		expect(user.body.data.email).toContain('emeka@gmail.com');
	});

	it('GET /api/users => get all users', async () => {
		const users = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(users.body.success).toBe(true);
		expect(users.body.count).toBe(1);
		expect(users.body.data).toBeDefined();
	});
});
