const format = require("pg-format");
const db = require("../connection");

exports.checkExists = async (table, column, value) => {
	const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
	const dbOutput = await db
		.query(queryStr, [value])
		.catch(err => Promise.reject({ status: 400, msg: "bad request" }));
	if (dbOutput.rows.length === 0) {
		return Promise.reject({ status: 404, msg: "resource not found" });
	}
	return "exists";
};
