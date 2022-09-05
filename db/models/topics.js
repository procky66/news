const db = require("../connection");

exports.fetchTopics = () => {

	const queryStr = `SELECT * FROM topics;`;

	return db.query(queryStr).
	then(results => {
		if (results.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "no topics found" });
		} else return results.rows;
	});;
};