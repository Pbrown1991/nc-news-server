const { ident } = require("pg-format");
const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticlesById,
  fetchCommentsByArticleId,
  postingCommentByArticleId,
  patchingArticlesById,
  deletingCommentsByCommentId,
  sortingArticlesQuery,
  sortingTopicsQuery
} = require("../models/news.models");
const { checkUserExists, checkArticleExists } = require("../utils.js");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const getArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query
  fetchArticles(topic, sort_by, order).then((articles) => {
    response.status(200).send({ articles });
  })
    .catch(next);
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

  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Invalid input" });
  }


  
  checkArticleExists(article_id)
    .then(() => {
      return fetchCommentsByArticleId(article_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      
      next(err)
    });
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

const patchArticlesByArticleId = (request, response, next) => {
  const { article_id } = request.params
  const { inc_votes } = request.body
  if (typeof inc_votes !== 'number') {
    return next({ status: 400, msg: 'Invalid vote data type' })
  }
  checkArticleExists(article_id)
    .then(() => patchingArticlesById(article_id, inc_votes))
    .then((updatedArticle) => {
      response.status(202).send({ article: updatedArticle })
    })
    .catch(next);
}

const deleteCommentsByCommentId = (request, response, next) => {
  const { comment_id } = request.params
  const numId = Number(comment_id)
  if (!Number.isInteger(numId)) {
    return Promise.reject({ status: 400, msg: 'Invalid comment ID' })
  }
  deletingCommentsByCommentId(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next)
}



module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getArticlesById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticlesByArticleId,
  deleteCommentsByCommentId
};
