const express = require('express')
const app = express();
const db = require('./db/connection')
const endpointsJson = require('./endpoints.json')
app.use(express.json());
const {getTopics, getArticles,getUsers, getArticlesById, getCommentsByArticleId,postCommentByArticleId, patchArticlesByArticleId, deleteCommentsByCommentId,sortArticlesQuery} = require('./controllers/news.controllers')


app.get('/api/articles', sortArticlesQuery);

app.get('/api', (request, response) => {
    response.status(200).send({ endpoints: endpointsJson })
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticlesByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentsByCommentId)




app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        return res.status(400).send({msg: "Invalid input"})
    } else next (err)
})


app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).send({ msg: err.msg });
    } else next(err)
})



app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).send({msg: "Internal Server Error"})
})




module.exports = app