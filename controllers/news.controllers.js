const { fetchTopics, fetchArticles, fetchUsers } = require('../models/news.models')

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

module.exports = {getTopics, getArticles, getUsers}