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
		test("status:404, article not found error when passed a valid, but non-existant key", () => {
			const ARTICLE_ID = 99;
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("article not found");
				});
		});
		test("status:400, bad request error when passed an invalid key", () => {
			const ARTICLE_ID = 'BadKey';
			return request(app)
				.get(`/api/articles/${ARTICLE_ID}`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("bad request");
				});
		});
	});
});
