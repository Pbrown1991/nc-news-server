const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const app = require('../app.js')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object with the key of topics containing an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        //const topic = body.topics[0]
        const { topics } = body
        expect(topics.length).not.toBe(0)
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string')
          expect(typeof topic.description).toBe('string')
        })
        
    })
  })
})

describe('GET = /api/articles', () => {
  test('200: Responds with an object with the key of articles and the value of an array of article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body        
        expect(articles.length).not.toBe(0)
        articles.forEach((article) => {
          expect(typeof article.author).toBe('string')
          expect(typeof article.title).toBe('string')
          expect(typeof article.article_id).toBe('number')
          expect(typeof article.topic).toBe('string')
          expect(typeof article.created_at).toBe('string')
          expect(typeof article.votes).toBe('number')
          expect(typeof article.article_img_url).toBe('string')
          expect(typeof article.comment_count).toBe('number')
          expect(article).not.toHaveProperty('body')
        })
    })
  })
})

describe('GET = /api/users', () => {
  test('GET - 200 - responds with an object with the key of users and the value of an array of objects.', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body }) => {
      const { users } = body
      expect(users.length).not.toBe(0)
      users.forEach((user) => {
        expect(typeof user.username).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
      })
  })
  
  })

})

describe('GET = /api/articles/:article_id', () => {
  test('GET - 200 - responds with an object with the key of article and the value of an article object', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const { author, title, article_id, body: article_body, topic, created_at, votes, article_img_url } = body.article // naming conflict - rename body
        expect(typeof author).toBe('string')
        expect(typeof title).toBe('string')
        expect(typeof article_id).toBe('number')
        expect(typeof article_body).toBe('string')
        expect(typeof topic).toBe('string')
        expect(typeof created_at).toBe('string')
        expect(typeof votes).toBe('number')
        expect(typeof article_img_url).toBe('string')
    })
  })
  test('GET - 404 - Responds with error message for an article_id that is invalid', () => {
    return request(app)
      .get('/api/articles/505')
      .expect(404)
      .then(({ body }) => {
      expect(body.msg).toBe('Article not found')
    })
  })
  test('GET - 400 - Responds with error message for an article_id input that is invalid', () => {
    return request(app)
      .get('/api/articles/potato')
      .expect(400)
      .then(({ body }) => {
      expect(body.msg).toBe('Invalid input')
    })
  })
})

describe('GET = /api/articles/:article_id/comments', () => {
  test('GET - 200 - Responds with an object with the key of "comments" and the value of an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        console.log(comments)
        expect(comments.length).not.toBe(0)
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe('number')
          expect(typeof comment.votes).toBe('number')
          expect(typeof comment.created_at).toBe('string')
          expect(typeof comment.author).toBe('string')
          expect(typeof comment.body).toBe('string')
          expect(typeof comment.article_id).toBe('number')
      })
    })
  })
})