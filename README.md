# Northcoders House of Games API

## Setup

Fork this repository to your own GitHub account.

Clone your fork of this repository to your local machine.

You will need to ensure you update your package.json with the command

```zsh
npm i
```

In order to use this project locally, ensure you add 2 .env.test and a .env.database files. Link to your database using `PGDATABASE=your_database`.

Don't forget to initialize and seed your database.

---

Paths to back end

for Users:
GET -> /api/users

for Categories:
GET -> /api/categories

for reviews:
GET -> /api/reviews
GET -> /api/reviews/:review:id
PATCH -> /api/reviews/:review:id

for comments
POST -> /api/reviews/:review_id/comments
GET -> /api/reviews/:review_id/comments