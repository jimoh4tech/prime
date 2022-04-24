/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Response } from 'superagent';
import supertest from 'supertest';
import { app, prisma } from '../app';

const api = supertest(app);
const initialUser = {
	username: 'jonas',
	email: 'jonas@gmail.com',
	password: '123456',
};

const initialPost = {
	title: 'Docker technology',
	content: 'Testing with docker and prisma client',
	imageUrl: 'http://localhost:3000',
};

let login: Response;
let posts: Response;
beforeAll(async () => {
	
	await prisma.comment.deleteMany({});
	await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  
	await api.post('/api/v1/users').send(initialUser);
	login = await api.post('/api/v1/login').send(initialUser);
		await api
			.post('/api/v1/posts')
			.set('Authorization', `Bearer ${login.body.token}`)
			.send(initialPost);
	posts = await api.get('/api/v1/posts');
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe('Comment API', () => {
	it('POST /api/v1/comments', async () => {
		await api
			.post('/api/v1/comments')
			.set('Authorization', `Bearer ${login.body.token}`)
			.send({
				content: 'Excellent write-up.',
				postId: posts.body.data[0].id,
			})
			.expect(201)
			.expect('Content-Type', /application\/json/);
	});

	it('GET /api/v1/comments', async () => {
		const comments = await api
			.get('/api/v1/comments')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(comments.body.success).toBe(true);
		expect(comments.body.count).toBe(1);
		expect(comments.body.data).toBeDefined();
	});

	it('PUT /api/v1/comments/:id', async () => {
		const comments = await api.get('/api/v1/comments');
		const comment = comments.body.data[0];
		await api
			.put(`/api/v1/comments/${comment.id}`)
			.set('Authorization', `Bearer ${login.body.token}`)
			.send({
				content: 'Excellent write-up and superb.',
			})
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	it('DELETE /api/v1/comments', async () => {
		const comments = await api.get('/api/v1/comments');
		const comment = comments.body.data[0];
		await api
			.delete(`/api/v1/comments/${comment.id}`)
			.set('Authorization', `Bearer ${login.body.token}`)
			.expect(204);
	});
});
