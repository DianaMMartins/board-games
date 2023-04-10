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

## Paths available:

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