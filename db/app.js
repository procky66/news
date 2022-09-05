const express = require("express");
const { getTopics } = require("./controllers/topics");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

app.use((error, request, response, next) => {
	console.log(error, "<<<<<<<error");
	response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;