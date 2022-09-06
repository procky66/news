const request = require("supertest");
require("jest-sorted");
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
		test("status:200, responds with an array of topics", () => {
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

describe("/api/articles", () => {
	describe("GET", () => {
		test("status:200, responds with an array of articles", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(response => {
					const { articles } = response.body;
					expect(articles).toBeInstanceOf(Array);
					expect(articles).toHaveLength(12);
					articles.forEach(article => {
						expect(article).toEqual(
							expect.objectContaining({
								article_id: expect.any(Number),
								title: expect.any(String),
								topic: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								comment_count: expect.any(Number),
							})
						);
					});
				});
		});

		test("status:200, responds with an array of articles sorted by date in descending order", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(response => {
					const { articles } = response.body;

					expect(articles).toBeSortedBy("created_at", {
						coerce: true,
						descending: true,
					});
				});
		});

		test("status:200, responds with an array of articles which match the topic provided by a query of topic", () => {
			return request(app)
				.get("/api/articles?topic=mitch")
				.expect(200)
				.then(response => {
					const { articles } = response.body;

					expect(articles).toBeInstanceOf(Array);
					expect(articles).toHaveLength(11);

					articles.forEach(article => {
						expect(article.topic).toBe("mitch");
					});
				});
		});

		test("status:200, responds with an empty array if no articles exist for a valid topic", () => {
			return request(app)
				.get("/api/articles?topic=paper")
				.expect(200)
				.then(response => {
					const { articles } = response.body;
					expect(articles).toEqual([]);
				});
		});

		test("status:404, topic not found for an invalid topic", () => {
			return request(app)
				.get("/api/articles?topic=nogood")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("topic not found");
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
						comment_count: 2,
					});
				});
		});
		test("status:200, article has comment_count matching number of comments for this article", () => {
			const ARTICLE_ID = 1;
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(200)
				.then(({ body }) => {
					expect(body.article.comment_count).toBe(11);
				});
		});
		test("status:200, article has comment_count 0 if no comments for this article", () => {
			const ARTICLE_ID = 12;
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(200)
				.then(({ body }) => {
					expect(body.article.comment_count).toBe(0);
				});
		});
		test("status:400, bad request error when passed an invalid article_id", () => {
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

		test("status:400, bad request error when passed an invalid article_id", () => {
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

		test("status:400, bad request error when passed a valid article_id, but invalid body", () => {
			const ARTICLE_ID = 3;
			const inc_votes = { inc_votes: "Z" };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(inc_votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});

		test("status:400, bad request error when passed a valid article_id, and body does not contain inc_votes property", () => {
			const ARTICLE_ID = 3;
			const no_inc_votes = { random: "Z" };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(no_inc_votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});

		test("status:404, article not found", () => {
			const ARTICLE_ID = 99;
			const inc_votes = { inc_votes: 7 };
			return request(app)
				.patch(`/api/articles/${ARTICLE_ID}`)
				.send(inc_votes)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("article not found");
				});
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET", () => {
		test("status:200, responds with an array of comments for a valid article", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(response => {
					const { comments } = response.body;
					expect(comments).toBeInstanceOf(Array);
					expect(comments).toHaveLength(11);

					comments.forEach(comment => {
						expect(comment).toEqual(
							expect.objectContaining({
								comment_id: expect.any(Number),
								body: expect.any(String),
								article_id: expect.any(Number),
								author: expect.any(String),
								votes: expect.any(Number),
								created_at: expect.any(String),
							})
						);
					});
				});
		});

		test("status:200, responds with an empty array for a valid article with no comments", () => {
			const ARTICLE_ID = "12";
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}/comments`)
				.expect(200)
				.then(response => {
					const { comments } = response.body;
					expect(comments).toEqual([]);
				});
		});

		test("status:400, bad request error when passed an invalid article_id", () => {
			const ARTICLE_ID = "BadKey";
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}/comments`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});
	});
});
describe("/api/users", () => {
	describe("GET", () => {
		test("status:200, responds with an array of users", () => {
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
