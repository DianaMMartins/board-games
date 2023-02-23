const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed.js");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("app", () => {
  describe("/api/categories", () => {
    test("200: responds with an array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const categories = body;
          expect(categories.length).toBeGreaterThan(0);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("/api/reviews", () => {
    test("200: responds with an array of reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((body) => {
          const reviews = body.body;
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));
          });
          const expectArray = reviews.map((review) => review.comment_count);
          expect(expectArray).toEqual([0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0]);
        });
    });
    test("200: accepts a sort_by query of date in descending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const reviews = body;
          expect(reviews.length).toBeGreaterThan(0);
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
            coerce: false,
          });
        });
    });
  });
  describe("/api/reviews?sort_by", () => {
    test("400: invalid sort by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=invalid_sort")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid Request");
        });
    });
  });
  describe("/api/review/:review_id", () => {
    //help
    test("200: GET responds with a single review object", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const returnedObject = body.review;
          expect(returnedObject).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });

    test("400: GET invalid review_id endpoint", () => {
      return request(app)
        .get("/api/reviews/cake")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request!");
        });
    });
    test("404: GET responds with error message if requested review doesn't exist but is valid", () => {
      return request(app)
        .get("/api/reviews/2000")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found!");
        });
    });
  });

  describe("/api/review/:review_id/comments", () => {
    test("200: GET responds with an array", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
        });
    });
    test("200: GET responds with an empty array if no comment exists", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    test("200: GET responds with an array of comments as objects with specific properties", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                review_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("400: GET invalid review_id endpoint when getting comments", () => {
      return request(app)
        .get("/api/reviews/cake/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request!");
        });
    });
    test("404: GET responds with error message if requested review doesn't exist but is valid", () => {
      return request(app)
        .get("/api/reviews/2000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found!");
        });
    });
    // 400 invalid review_id/comment
    // 404 bad request/comment
  });
  describe("/anyWrongPath", () => {
    test("404: invalid sort request", () => {
      return request(app)
        .get("/apz")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("404: Path not found!");
        });
    });
  });
});
