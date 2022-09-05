const db = require("../connection");
const { fetchArticleById, updateArticleById } = require("../models/articles");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	fetchArticleById(article_id)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => next(err));
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { body } = req;
	const inc_votes = body.inc_votes;

	updateArticleById(article_id, inc_votes)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => next(err));
};
