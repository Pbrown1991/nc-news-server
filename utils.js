const db = require("./db/connection");

const checkUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query(
            `INSERT INTO users (username, name, avatar_url)
                     VALUES ($1, $2, $3) RETURNING *`,
            [username, "Unknown", "https://example.url/random.jpg"]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return rows[0];
      }
    });
};


const checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
            return Promise.reject({status:404, msg:`Article ID ${article_id} not found`})
            }
            return;
    })
}

module.exports = { checkUserExists,checkArticleExists };
