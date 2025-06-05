const express = require('express')
const app = express();
const db = require('./db/connection')
const endpointsJson = require('./endpoints.json')
app.use(express.json());
const {getTopics, getArticles,getUsers, getArticlesById} = require('./controllers/news.controllers')


app.get('/api', (request, response) => {
    response.status(200).send({ endpoints: endpointsJson })
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticlesById)




app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).send({ msg: err.msg });
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        return res.status(400).send({msg: "Invalid input"})
    } else next (err)
})

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).send({msg: "Internal Server Error"})
})




module.exports = app