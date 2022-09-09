const { deleteCommentById } = require("../controllers/articles");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
