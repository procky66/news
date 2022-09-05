const db = require("../connection");

exports.fetchTopics = () => {
	const queryStr = `SELECT * FROM topics;`;

	return db.query(queryStr).then(results => results.rows);
};
