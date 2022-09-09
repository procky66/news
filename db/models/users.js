const db = require("../connection");

exports.fetchUsers = () => {
	const queryStr = `SELECT * FROM users;`;

	return db.query(queryStr).then(results => results.rows);
};

exports.fetchUserById = username => {
	return db
		.query("SELECT * FROM users WHERE username = $1;", [username])
		.then(results => {
			if (results.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "user not found" });
			} else return results.rows[0];
		});
};
