const express = require("express");

const router = require("./routes/router");
const apiRouter = require("./routes/api.router");

const app = express();
app.use(express.json());

app.use("/", router);
app.use("/api", apiRouter);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

app.use((error, request, response, next) => {
	if (error.code === "22P02" || error.code === "23502") {
		response.status(400).send({ msg: "bad request" });
	} else if (error.code === "23503") {
		response.status(404).send({ msg: "not found" });
	} else next(error);
});

app.use((error, request, response, next) => {
	console.log(error, "<<<<<<<error");
	response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
