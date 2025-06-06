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

const fetchCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY comments.created_at DESC;`, [id])
        .then(({ rows }) => {
        return rows
    }) 
}

const postingCommentByArticleId = (article_id, username, body) => {
   
    return db.query(`INSERT INTO comments(article_id, author, body)
        VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body])
        .then(({ rows }) => {
        return rows
    })
    
}

const patchingArticlesById = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes +$1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
        .then(({ rows }) => {
            return rows[0]
            
    })
}




module.exports = {fetchTopics, fetchArticles, fetchUsers, fetchArticlesById, fetchCommentsByArticleId, postingCommentByArticleId,patchingArticlesById}