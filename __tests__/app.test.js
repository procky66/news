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
