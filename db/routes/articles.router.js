const {
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentOnArticle,
	patchArticleById,
} = require("../controllers/articles");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentOnArticle);

articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
