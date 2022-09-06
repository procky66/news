const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => {
	db.end();
});

beforeEach(() => seed(testData));

describe("/api/topics", () => {
	describe("GET", () => {
		test("200, responds with an array of topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(response => {
					const { topics } = response.body;
					expect(topics).toBeInstanceOf(Array);
					expect(topics).toHaveLength(3);

					topics.forEach(topic => {
						expect(topic).toEqual(
							expect.objectContaining({
								slug: expect.any(String),
								description: expect.any(String),
							})
						);
					});
				});
		});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		test("status:200, responds with a single matching article", () => {
			const ARTICLE_ID = 3;
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toEqual({
						article_id: ARTICLE_ID,
						title: "Eight pug gifs that remind me of mitch",
						topic: "mitch",
						author: "icellusedkars",
						body: "some gifs",
						created_at: "2020-11-03T09:12:00.000Z",
						votes: 0,
					});
				});
		});
		test("status:400, bad request error when passed an invalid key", () => {
			const ARTICLE_ID = "BadKey";
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});
	});
	describe("PATCH", () => {
		test("status: 200, responds with the updated article object", () => {
			const ARTICLE_ID = 3;
			const inc_votes = { inc_votes: 5 };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(inc_votes)
				.expect(200)
                .then(({ body }) => {
					expect(body.article).toEqual({
						article_id: ARTICLE_ID,
						title: "Eight pug gifs that remind me of mitch",
						topic: "mitch",
						author: "icellusedkars",
						body: "some gifs",
						created_at: "2020-11-03T09:12:00.000Z",
						votes: 5,
					});
				});
		});

		test("status: 200, responds with the updated article object when passed a negative vote count", () => {
			const ARTICLE_ID = 3;
			const inc_votes = { inc_votes: -100 };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(inc_votes)
				.expect(200)
                .then(({ body }) => {
					expect(body.article).toEqual({
						article_id: ARTICLE_ID,
						title: "Eight pug gifs that remind me of mitch",
						topic: "mitch",
						author: "icellusedkars",
						body: "some gifs",
						created_at: "2020-11-03T09:12:00.000Z",
						votes: -100,
					});
				});
		});

		test("status:400, bad request error when passed an invalid key", () => {
			const ARTICLE_ID = "BadKey";
			const inc_votes = { inc_votes: 99 };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
                .send(inc_votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});

		test("status:400, bad request error when passed a valid key, but invalid body", () => {
			const ARTICLE_ID = 3;
			const inc_votes = { inc_votes: 'Z' };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(inc_votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});

		test("status:400, bad request error when passed a valid key, and body does not contain inc_votes property", () => {
			const ARTICLE_ID = 3;
			const no_inc_votes = { random: 'Z' };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(no_inc_votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});
	});
});

describe("/api/users", () => {
	describe("GET", () => {
		test("200, responds with an array of users", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(response => {
					const { users } = response.body;
					expect(users).toBeInstanceOf(Array);
					expect(users).toHaveLength(4);

					users.forEach(user => {
						expect(user).toEqual(
							expect.objectContaining({
								username: expect.any(String),
								name: expect.any(String),
								avatar_url: expect.any(String),
							})
						);
					});
				});
		});
	});
});
