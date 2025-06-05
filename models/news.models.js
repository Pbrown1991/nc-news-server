const db = require('../db/connection')

const fetchTopics = () => {
    return db.query(`SELECT * from topics`)
        .then(({rows}) => {
        return rows
    })
}

const fetchArticles = () => {
    return db.query(`SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id):: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
        `)
        .then(({ rows }) => {
        return rows
    })
}

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows
        })
}

const fetchArticlesById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
        return rows
    })
}

module.exports = {fetchTopics, fetchArticles, fetchUsers, fetchArticlesById}