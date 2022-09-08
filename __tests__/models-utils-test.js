const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { checkExists } = require("../db/models/models-utils");

afterAll(() => {
	db.end();
});

beforeAll(() => seed(testData));

describe("checkExists", () => {
	test.only("status:404, error when passed value is not found in table/column", async () => {
		await checkExists("topics", "slug", "xxxxx").catch(err => {
			expect(err.status).toBe(404);
			expect(err.msg).toBe("resource not found");
		});
	});

	test.only("status:400, bad request if table or column are invalid",async ()=>{
		await checkExists("xxxxx", "slug", "paper").catch(err => {
			expect(err.status).toBe(400);
			expect(err.msg).toBe("bad request");
		});
		await checkExists("topics", "xxxxx", "paper").catch(err => {
			expect(err.status).toBe(400);
			expect(err.msg).toBe("bad request");
		});
	})

	test.only("returns 'exists' if value exists in table/column", async () => {
		const table = "topics";
		const column = "slug";
		const value = "paper";
		await checkExists(table, column, value).then(data => {
			expect(data).toBe("exists");
		});
	});
});