const db = require("../connection");
const { fetchArticleById, updateArticleById, fetchArticles, fetchCommentsByArticleId, insertCommentOnArticle } = require("../models/articles");

exports.getArticles = (req, res, next) => {
	const {topic,sorted_by, order} = req.query;
	fetchArticles(topic, sorted_by, order)
		.then(articles => {
			res.status(200).send({ articles });
		})
		.catch(err => next(err));
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	fetchArticleById(article_id)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	fetchCommentsByArticleId(article_id)
		.then(comments => {
			res.status(200).send({ comments });
		})
		.catch(err => next(err));
};

exports.postCommentOnArticle = (req, res, next) => {
	const {article_id} = req.params;
	const {author, body} = req.body;
	insertCommentOnArticle(article_id, author, body
		).then(comment =>{
			res.status(200).send({comment})
		}).catch(err => next(err));
}

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;

	updateArticleById(article_id, inc_votes)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => next(err));
};
