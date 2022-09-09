exports.handle400s = (err, req, res, next) => {
	if (
	  err.code === '22P02' ||
	  err.code === '23502' ||
	  err.status === 400
	)
	  res.status(400).send({ msg: err.msg || 'bad request' });
	else next(err);
};

exports.handle404s = (err, req, res, next) => {
	 if (err.code === '23503' ||err.status === 404)
	 	res.status(404).send({ msg: err.msg || "not found" });
	 else next(err);
};

exports.handle500s = (err, req, res, next) => {
	console.log("Unhandled Error:", err);
	res.status(500).send({ msg: "Internal Server Error" });
};
