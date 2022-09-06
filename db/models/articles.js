const db = require("../connection");

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
