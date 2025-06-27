const db = require('../db/connection')

const fetchTopics = () => {
    return db.query(`SELECT * from topics`)
        .then(({ rows }) => {
            return rows
        })
}

const fetchArticles = (topic, sort_by = 'created_at', order = 'DESC') => {

    const validColumns = ['author', 'title', 'created_at', 'article_id', 'votes', 'comment_count']
    const validOrders = ['ASC', 'DESC']

    sort_by = sort_by.toLowerCase();
    order = order.toUpperCase();

    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
    }

    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order value' });
    }
    const queryValues = []

    let queryStr = `SELECT 
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
        `;


    const validateTopicQuery = topic
        ? db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: 'Topic not found' });
                }
            })
        : Promise.resolve();


    if (topic) {
        queryStr += ` WHERE articles.topic = $1 `;
        queryValues.push(topic)
    }

    queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

    return validateTopicQuery.then(() => {
        return db.query(queryStr, queryValues)
            .then(({ rows }) => {
                return rows
            })
    })

}

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows
        })
}

const fetchArticlesById = (id) => {
    return db.query(`
    SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.body,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `, [id])
        .then(({ rows }) => {
            return rows
        })
}

const fetchCommentsByArticleId = (id) => {
    return db.query(`
    SELECT 
      comment_id,
      votes,
      created_at,
      author,
      body,
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `, [id])
        .then(({ rows }) => {
            return rows;
        });
};

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
                return Promise.reject({ status: 404, msg: `Comment ID ${comment_id} not found` })
            }
        })

}








module.exports = { fetchTopics, fetchArticles, fetchUsers, fetchArticlesById, fetchCommentsByArticleId, postingCommentByArticleId, patchingArticlesById, deletingCommentsByCommentId }