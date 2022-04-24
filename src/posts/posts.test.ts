/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Response } from 'superagent';
import supertest from 'supertest';
import { app, prisma } from '../app';

const api = supertest(app);
const initialUser = {
	username: 'yusuf',
	email: 'yusuf@gmail.com',
	password: '123456',
};

const initialPosts = [
	{
		title: 'Postgres prisma',
		content: 'Testing with docker and prisma client',
		imageUrl: 'http://localhost:3000',
	},
	{
		title: 'Docker technology',
		content: 'Testing with docker and prisma client',
		imageUrl: 'http://localhost:3000',
	},
];
let login: Response;
beforeAll(async () => {
	await prisma.comment.deleteMany({});
	await prisma.post.deleteMany({});
	await prisma.user.deleteMany({});
	
	await api.post('/api/v1/users').send(initialUser);
	login = await api.post('/api/v1/login').send(initialUser);
	await api
		.post('/api/v1/posts')
		.set('Authorization', `Bearer ${login.body.token}`)
		.send(initialPosts[0]);
});

afterAll(async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	await prisma.$disconnect();
});

describe('Post API', () => {
	it('POST /api/v1/posts => new post can be added', async () => {
		const post = await api
			.post('/api/v1/posts')
			.set('Authorization', `Bearer ${login.body.token}`)
			.send(initialPosts[1])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(post.body.success).toBe(true);
		expect(post.body.data.title).toContain(initialPosts[1].title);
		expect(post.body.data.content).toContain(initialPosts[1].content);
	});

	it('GET /api/v1/posts => can get all posts', async () => {
		const posts = await api
			.get('/api/v1/posts')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(posts.body.success).toBe(true);
		expect(posts.body.count).toBe(2);
		expect(posts.body.data).toBeDefined();
	});

	it('PUT /api/v1/posts/:id/likes => like post', async () => {
		const postsAtStart = await api.get('/api/v1/posts');
		const post = postsAtStart.body.data[0];
		await api
			.put(`/api/v1/posts/${post.id}/likes`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	it('PUT /api/v1/posts/:id -> can update post', async () => {
		const postsAtStart = await api.get('/api/v1/posts');
		const post = postsAtStart.body.data[0];
		const login = await api.post('/api/v1/login').send(initialUser).expect(200);
		await api
			.put(`/api/v1/posts/${post.id}`)
			.set('Authorization', `Bearer ${login.body.token}`)
			.send({
				title: 'Docker for tech',
			})
			.expect(200)
			.expect('Content-Type', /application\/json/);
  });
  
  it('DELETE /api/v1/posts/:id -> can delete post', async () => {
		const postsAtStart = await api.get('/api/v1/posts');
		const post = postsAtStart.body.data[0];
		const login = await api.post('/api/v1/login').send(initialUser).expect(200);
    await api
      .delete(`/api/v1/posts/${post.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(204);
	});
});
