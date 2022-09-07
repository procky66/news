const db = require("../connection");

exports.fetchArticles = (topic, sorted_by = "created_at", order = "desc") => {
	const validSortColumns = ["article_id","title","topic","author","body","created_at","votes"]
	const validOrderTerms = ["asc", "desc"]

	if(!validSortColumns.includes(sorted_by) || !validOrderTerms.includes(order)){
		return Promise.reject({status:400, msg: "invalid sort criteria"})
	}
	const orderClause = `ORDER BY ${sorted_by} ${order}`

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

	return db.query(queryStr, queryParams).then(async results => {
		if (topic && results.rows.length === 0) {
			const check = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
				topic,
			]);

			if (check.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "topic not found" });
			}
		}
		return results.rows;
	});
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
	results = await db
		.query(
			`SELECT * FROM comments 
			WHERE article_id = $1;`,
			[article_id]
		)
		.catch(err => Promise.reject(err));
	if (results.rows.length === 0) {
		const check = await db.query(
			`SELECT * FROM articles WHERE article_id = $1;`,
			[article_id]
		);
		if (check.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "article not found" });
		}
	}
	return results.rows;
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
