const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticlesById,
  fetchCommentsByArticleId,
  postingCommentByArticleId,
} = require("../models/news.models");
const { checkUserExists, checkArticleExists } = require("../utils.js");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

const getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesById(article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return next({ status: 404, msg: "Article not found" });
      }
      response.status(200).send({ article: articles[0] });
    })
    .catch(next);
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return next({ status: 404, msg: "Article not found" });
      }
      response.status(200).send({ comments: comments });
    })
    .catch(next);
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (
    !username ||
    typeof username !== "string" ||
    !body ||
    typeof body !== "string" ||
    body.trim() == ""
  ) {
    return next({
      status: 400,
      msg: "Bad request: username & body must be present and be strings",
    });
  }
  checkArticleExists(article_id)
    .then(() => checkUserExists(username))
    .then(() => postingCommentByArticleId(article_id, username, body))
    .then((comment) => {
      response.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getArticlesById,
  getCommentsByArticleId,
  postCommentByArticleId,
};
