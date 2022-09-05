const db = require("../connection");

exports.fetchUsers = () => {
	const queryStr = `SELECT * FROM users;`;

	return db.query(queryStr).then(results => results.rows);
};
