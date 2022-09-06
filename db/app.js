const express = require("express");
const { getArticleById, patchArticleById, getArticles } = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const { getUsers } = require("./controllers/users");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

app.use((error, request, response, next) => {
	if ((error.code = "22P02")) {
		response.status(400).send({ msg: "bad request" });
	} else next(error);
});

app.use((error, request, response, next) => {
	console.log(error, "<<<<<<<error");
	response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
