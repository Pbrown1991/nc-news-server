const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");



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
        const { topics } = body;
        expect(topics.length).not.toBe(0);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET = /api/articles", () => {
  test("200: Responds with an object with the key of articles and the value of an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).not.toBe(0);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET = /api/users", () => {
  test("GET - 200 - responds with an object with the key of users and the value of an array of objects.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).not.toBe(0);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET = /api/articles/:article_id", () => {
  test("GET - 200 - responds with an object with the key of article and the value of an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const {
          author,
          title,
          article_id,
          body: article_body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = body.article; 
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof article_body).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(article_id).toBe(1);
      });
  });
  test("GET - 404 - Responds with error message for an article_id that is not present", () => {
    return request(app)
      .get("/api/articles/505")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("GET - 400 - Responds with error message for an article_id input that is invalid", () => {
    return request(app)
      .get("/api/articles/potato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET = /api/articles/:article_id/comments", () => {
  test('GET - 200 - Responds with an object with the key of "comments" and the value of an array of comments for the given article_id', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).not.toBe(0);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(comment.article_id).toBe(1);
        });
        for (let i = 0; i < comments.length - 1; i++) {
          const current = new Date(comments[i].created_at);
          const next = new Date(comments[i + 1].created_at);
          expect(current >= next).toBe(true);
        }
      });
  });
  test("GET - 404 - Responds with error message for an article_id that is not present", () => {
    return request(app)
      .get("/api/articles/505/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article ID 505 not found');
      });
  });
  test("GET - 400 - Responds with correct error message for an article_id input that is invalid", () => {
    return request(app)
      .get("/api/articles/potato/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("POST = /api/articles/:article_id/comments", () => {
  test("POST - 201 - Responds with the posted comment and has updated the comments table", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "Ricketycricket",
        body: "Rise up! Gonna get higher and higher",
      })
      .expect(201)
      .then(({ body }) => {
        const {
          article_id,
          comment_id,
          body: comment_body,
          votes,
          author,
          created_at,
        } = body.comment;
        expect(typeof article_id).toBe("number");
        expect(typeof comment_id).toBe("number");
        expect(typeof comment_body).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(article_id).toBe(1);
      });
  });
  test('POST - 400 - Responds with "Bad request" when fed an invalid or incomplete set of data ', () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "Ricketycricket",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: username & body must be present and be strings"
        );
      });
  });
  test('POST - 404 - Responds with "Article ID not found" when presented with an invalid article ID number', () => {
    return request(app)
      .post("/api/articles/27/comments")
      .send({
        username: "Ricketycricket",
        body: "Rise up! Gonna get higher and higher",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID 27 not found");
      });
  });
});

describe('PATCH = /api/articles/:article_id', () => {
  test('PATCH - 202 - Responds with the specified updated article object with an updated votes property', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 5 })
      .expect(202)
      .then(({ body }) => {
        const {
          author,
          title,
          article_id,
          body: article_body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = body.article;
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof article_body).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(article_id).toBe(1);
        expect(votes).toBe(105)
      })
    
  })
  test('PATCH - 404 - Responds with 404 error when article_id is not found', () => {
    return request(app)
      .patch('/api/articles/27')
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article ID 27 not found')
      })
  })
  test('PATCH - 400 - Responds with 400 error message when inc_votes is passed an invalid data type', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'potato' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid vote data type')
      })
  })
})

describe('DELETE = /api/comments/:comment_id', () => {
  test('DELETE - 204 - Responds by deleting the comment at the chosen comment_id', () => {
    return request(app)
      .delete('/api/comments/17')
      .expect(204)
  })
  test('DELETE - 404 - Responds with 404 when comment ID is not found', () => {
    return request(app)
      .delete('/api/comments/1000')
      .expect(404)
      .then(({ body }) => {
      expect(body.msg).toBe('Comment ID 1000 not found')
    })
  })
  test('DELETE - 400 - Responds with 400 when comment_id is not valid', () => {
    return request(app)
      .delete('/api/comments/potato')
      .expect(400)
      .then(({ body }) => {
      expect(body.msg).toBe('Invalid comment ID')
    })
  })
})
  
describe('GET = /api/articles - SORT', () => {
  test('GET - 200 - Sorts the articles table by author in ascending order', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=asc')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles
        expect(articles).toBeSortedBy('author', { ascending: true });
    })
  })
  test('GET - 400 - invalid sort column', () => {
    return request(app)
      .get('/api/articles?sort_by=potato')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort_by column');
    })
  })
  test('GET - 400 - invalid order value', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=potato')
      .expect(400)
      .then(({ body }) => {
      expect(body.msg).toBe('Invalid order value')
    })
  })

});

describe('GET - 200 - /api/articles (topic query)', () => {
  test('GET - 200 - Serves articles filtered by the topic value specified in the query, will default to all articles if query is omitted', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).not.toBe(0)
        articles.forEach((article) => {
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(article.topic).toEqual('cats')
      })
    })
  })
  test('GET /api/articles?topic=invalidtopic returns 404', () => {
  return request(app)
    .get('/api/articles?topic=invalidtopic')
    .expect(404);
});
}) 

