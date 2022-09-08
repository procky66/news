const db = require("../connection");
const { checkExists } = require("./models-utils");

exports.fetchArticles = async (
	topic,
	sorted_by = "created_at",
	order = "desc"
) => {
	const validSortColumns = [
		"article_id",
		"title",
		"topic",
		"author",
		"body",
		"created_at",
		"votes",
	];
	const validOrderTerms = ["asc", "desc"];

	if (!validSortColumns.includes(sorted_by)) {
		return Promise.reject({ status: 400, msg: "invalid sorted_by criteria" });
	}
	if (!validOrderTerms.includes(order)) {
		return Promise.reject({ status: 400, msg: "invalid order criteria" });
	}
	const orderClause = `ORDER BY ${sorted_by} ${order}`;

	let whereClause = "";
	const queryParams = [];

	if (topic) {
		whereClause += `WHERE topic = $1`;
		queryParams.push(topic);
	}

	const queryStr = `SELECT articles.*, COUNT(comments.*)::INT AS "comment_count"
	FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
	${whereClause}
	GROUP BY articles.article_id
	${orderClause};`;

	results = await db.query(queryStr, queryParams);

	if (topic && results.rows.length === 0) {
		await checkExists("topics", "slug", topic);
	}
	return results.rows;
};

exports.fetchArticleById = article_id => {
	return db
		.query(
			`SELECT articles.*, COUNT(comments.*)::INT AS "comment_count"
			FROM articles LEFT JOIN comments
			ON articles.article_id = comments.article_id 
			WHERE articles.article_id = $1 
			GROUP BY articles.article_id;`,
			[article_id]
		)
		.then(results => {
			if (results.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "article not found" });
			} else return results.rows[0];
		});
};

exports.fetchCommentsByArticleId = async article_id => {
	const results = await db.query(
		`SELECT * FROM comments 
			WHERE article_id = $1;`,
		[article_id]
	);
	if (results.rows.length === 0) {
		await checkExists("articles", "article_id", article_id);
	}
	return results.rows;
};

exports.insertCommentOnArticle = async (article_id, author, body) => {
	if (!body || !author) {
		return Promise.reject({ status: 400, msg: "missing required field" });
	}

	const results = await db.query(
		"INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING *;",
		[article_id, author, body]
	);
	if (results.rows.length === 0) {
		await checkExists("articles", "article_id", article_id);
	}
	return results.rows[0];
};

exports.updateArticleById = (article_id, inc_votes) => {
	return db
		.query(
			"UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
			[inc_votes, article_id]
		)
		.then(results => {
			if (results.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "article not found" });
			} else return results.rows[0];
		});
};

exports.removeCommentById = async comment_id => {
	await checkExists("comments","comment_id", comment_id)
	await db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
};
