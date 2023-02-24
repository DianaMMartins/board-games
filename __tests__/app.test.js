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
  describe("/api/users", () => {
  //   test("200: responds with an array of users", () => {
  //     return request(app)
  //       .get("/api/users")
  //       .expect(200)
  //       .then(({ body }) => {
  //         console.log(body);
  //         const users = body;
  //         expect(users.length).toBeGreaterThan(0);
  //         users.forEach((user) => {
  //           expect(user).toHaveProperty("username", expect.any(String));
  //           expect(user).toHaveProperty("name", expect.any(String));
  //           expect(user).toHaveProperty("avatar_url", expect.any(String));
  //         });
  //       });
  //   });
  });
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
  describe("POST /api/reviews/:review_id/comments", () => {
    test("201: responds with newly created comment", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .expect(201)
        .send({
          username: "philippaclaire9",
          body: "A fun afternoon! Definitely recommend!!!",
        })
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            body: "A fun afternoon! Definitely recommend!!!",
            votes: 0,
            author: "philippaclaire9",
            review_id: 2,
            created_at: expect.any(String),
          });
        });
    });
    test("201: responds with newly created comment, but ignores any unnecessary properties", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .expect(201)
        .send({
          username: "philippaclaire9",
          body: "A fun afternoon! Definitely recommend!!!",
          cake: "BlackForest",
        })
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            body: "A fun afternoon! Definitely recommend!!!",
            votes: 0,
            author: "philippaclaire9",
            review_id: 2,
            created_at: expect.any(String),
          });
        });
    });
    test("400: POST invalid review_id endpoint when trying to POST comments", () => {
      return request(app)
        .post("/api/reviews/cake/comments")
        .send({
          username: "philippaclaire9",
          body: "A fun afternoon! Definitely recommend!!!",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request!");
        });
    });
    test("400: POST to valid review_id endpoint but given information is missing fields", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({ LOSER: 1 })
        .expect(400)
        .then(({body}) => {
          expect(body.message).toBe("Invalid property!");
        });
    });
    test("404: POST responds with error message if trying to POST to a review that doesn't exist but is valid", () => {
      return request(app)
        .post("/api/reviews/2000/comments")
        .send({
          username: "philippaclaire9",
          body: "A fun afternoon! Definitely recommend!!!",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found!");
        });
    });
    test("404: POST responds with error message if trying to POST to a review that exist but the username given is not valid", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "cakesAreLies",
          body: "A fun afternoon! Definitely recommend!!!",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid data!");
        });
    });
  });
  describe("PATCH: /api/reviews/:review_id", () => {
    test("200: PATCH RETURNS with an object of updated review", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          // console.log(review);
          // expect(review.length).toBeGreaterThan(0);
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 6,
          });
        });
    });
    test("200: PATCH RETURNS with an object of updated review, make sure it works for negative numbers", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -2 })
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          // console.log(review);
          // expect(review.length).toBeGreaterThan(0);
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 3,
          });
        });
    });
    test("200: PATCH RETURNS with an object of updated review, when all votes have been removed, set value at 0", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -200 })
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 0,
          });
        });
    });
    test("404: error message if trying to PATCH to a review that doesn't exist", () => {
      return request(app)
        .patch("/api/reviews/200")
        .send({ inc_votes: -2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found!");
        });
    });
    test("400: error message if trying to PATCH to a review that exists but the property to patch is not valid", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid property!");
        });
    });
    test("400: error message if trying to PATCH to a review that exists but the property to patch is not valid", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ key: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid property!");
        });
    });
  });
});
