const express = require("express");
const {
	getArticleById,
	patchArticleById,
	getArticles,
	getCommentsByArticleId,
	postCommentOnArticle,
	deleteCommentById,
} = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const { getUsers } = require("./controllers/users");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentOnArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById)

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

app.use((error, request, response, next) => {
	if ((error.code === "22P02" || error.code === "23502")) {
		response.status(400).send({ msg: "bad request" });
	} else if ((error.code === "23503")) {
		response.status(404).send({ msg: "not found" });
	} else next(error);
});

app.use((error, request, response, next) => {
	console.log(error, "<<<<<<<error");
	response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
