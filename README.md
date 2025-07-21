# NC News

A RESTful API for a reddit-style news app. Users can:

- View all articles
- Filter articles by topic
- View comment counts
- Post and delete comments
- Vote on articles

🟢 Live API - https://pb-news-server.onrender.com/

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Jest & Supertest
- Jest-extended and Jest-sorted for additional matchers
- Husky for Git hooks
- CORS middleware for cross-origin requests

## Setup

1. Clone repository:

```bash
git clone https://github.com/Pbrown1991/nc-news-server
```

2. Install dependencies:

```bash
npm install
```

3. Environment variables
   Create the following .env files in the root of the project

- .env.development
- .env.test
- .env.production

```bash
# .env.development
PGDATABASE=nc_news
```

```bash
# .env.test
PGDATABASE=nc_news_test
```

```bash
# .env.production
DATABASE_URL=your_production_database_url_here
```

4. Set up databases:

```bash
npm run setup-dbs
```

5. Seed databases

- For development / testing:

```bash
npm run seed
```

- For production:

```bash
npm run seed-prod
```

6. Run tests:

```bash
npm test
```
