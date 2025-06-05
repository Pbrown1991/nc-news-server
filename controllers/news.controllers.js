const { fetchTopics, fetchArticles, fetchUsers, fetchArticlesById } = require('../models/news.models')

const getTopics = (request, response) => {
    fetchTopics()
        .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticles = (request, response) => {
    fetchArticles()
        .then((articles) => {
        response.status(200).send({articles})
    })
}

const getUsers = (request, response) => {
    fetchUsers()
        .then((users) => {
        response.status(200).send({users})
    })
}

const getArticlesById = (request, response,next) => {
    const { article_id } = request.params;
    fetchArticlesById(article_id)
        .then((articles) => {
            if (articles.length === 0) {
                return next({ status: 404, msg: 'Article not found' });
            }
            response.status(200).send({ article: articles[0] })
        })
        .catch(next);
}

module.exports = {getTopics, getArticles, getUsers, getArticlesById}