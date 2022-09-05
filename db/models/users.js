const db = require("../connection");

exports.fetchUsers = () => {

	const queryStr = `SELECT * FROM users;`;

	return db.query(queryStr).
	then(results => {
		if (results.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "no users found" });
		} else return results.rows;
	});;
};