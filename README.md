# Northcoders House of Games API

My first back-end project. I developed this API during my bootcamp at Northcoders.

## Setup

If you want to experience with this API using [this link](https://board-games.onrender.com/)
or you can always fork this repository to your own GitHub account and experiment with it yourself.

Clone your fork of this repository to your local machine.

You will need to ensure you install all needed dependencies for this project with the command

```zsh
npm i
```

In order to use this project locally, ensure you create 2 local env files: 
* .env.test   
* .env.database  -> 
Link to your database using `PGDATABASE=your_database`.

Don't forget to initialize and seed your database.

---

## Paths available:
- GET -> `/api`

### Users:
- GET -> `/api/users`

### Categories:
- GET -> `/api/categories`

### Reviews:
- GET -> `/api/reviews`
- GET -> `/api/reviews/:parametric`
- PATCH -> `/api/reviews/:parametric`

    Available Reviews queries:
    - Queries:
        - `sort_by`:
            - "created_at" (default),
            - "title",
            - "designer",
            - "owner",
            - "review_img_url",
            - "review_body",
            - "category",
            - "votes"
            
        - `order` 
            - "asc", 
            - "desc" (default)

        - `category` that is exists in the database, defaults to give all reviews

### Comments
- POST -> `/api/reviews/:parametric/comments`
- GET -> `/api/reviews/:parametric/comments`
- GET -> `/api/comments/:parametric`
- DELETE -> `/api/comments/:parametric`