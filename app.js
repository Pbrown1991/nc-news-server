const express = require('express')
const app = express();
const db = require('./db/connection')
const endpointsJson = require('./endpoints.json')
app.use(express.json());
const {getTopics, getArticles,getUsers} = require('./controllers/news.controllers')


app.get('/api', (request, response) => {
    response.status(200).send({ endpoints: endpointsJson })
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)





module.exports = app