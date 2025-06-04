const { fetchTopics, fetchArticles } = require('../models/news.models')

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

module.exports = {getTopics, getArticles}