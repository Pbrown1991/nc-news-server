const db = require("../connection");
const format = require('pg-format');
const { convertTimestampToDate, createLookUpObject} = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(()=> db.query(`DROP TABLE IF EXISTS topics;`))
    .then(() => {
     return db.query( `CREATE TABLE topics(
    slug VARCHAR PRIMARY KEY,
    description VARCHAR,
    img_url VARCHAR(1000))`
      )
    })
      .then(() => {
        return db.query(`CREATE TABLE users(
    username VARCHAR PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR(1000))`
        )
        })
      .then(() => {
              return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
    author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
)`)
            })
      .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
    })
      .then(() => {
      const insertTopicData = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        topicData.map(({ slug, description, img_url }) => [slug, description, img_url])
      );
      return db.query(insertTopicData)
      })
    .then(() => {
      const insertUserData = format(`INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *;`,
        userData.map(({ username, name, avatar_url }) => [username, name, avatar_url])
      );
      return db.query(insertUserData)
    })
    .then(() => {
      const dateFixedArticle = articleData.map(convertTimestampToDate)
      const insertArticleData = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        dateFixedArticle.map(({title, topic, author, body, created_at, votes, article_img_url }) => [title, topic, author, body, created_at, votes, article_img_url])
      );
      
      return db.query(insertArticleData)
    })
    .then((data) => {
      const articleLookUp = createLookUpObject(data.rows, 'title', 'article_id')
      const dateFixedComments = commentData.map(convertTimestampToDate);
      const insertCommentsData = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        dateFixedComments.map(({article_title, body, votes, author, created_at })=> [articleLookUp[article_title], body, votes, author, created_at])
      );
      return db.query(insertCommentsData)
    })
      }
    
  
;
module.exports = seed;


