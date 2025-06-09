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

const deletingCommentsByCommentId = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*`, [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
            return Promise.reject({status:404, msg:`Comment ID ${comment_id} not found`})
        }
    })
    
}
const validColumns = ['author', 'title', 'created_at', 'article_id', 'votes']
const validOrders = ['ASC', 'DESC']
const sortingArticlesQuery = (column, order) => {
    if (!validColumns.includes(column)) column = 'created_at';
    if (!order) order = 'DESC'
    else if (!validOrders.includes(order.toUpperCase())) order = 'DESC'
    else order = order.toUpperCase()
    return db.query(`
    SELECT 
      articles.author, articles.title, articles.article_id, articles.topic,
      articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${column === 'author' || column === 'title' ? `LOWER(articles.${column})` : `articles.${column}`} ${order};
  `).then(({ rows }) => {
            return rows
        })
        .catch(err => {
            console.error('not working:', err);
            throw err
    })
}




module.exports = {fetchTopics, fetchArticles, fetchUsers, fetchArticlesById, fetchCommentsByArticleId, postingCommentByArticleId,patchingArticlesById,deletingCommentsByCommentId, sortingArticlesQuery}