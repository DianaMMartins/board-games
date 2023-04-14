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
  describe("/api", () => {
    
  })
  describe("/api/users", () => {
    test("200: responds with an array of users with properties of: username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body;
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty(
              "avatar_url",
              expect.stringContaining("https://")
            );
          });
        });
    });
    test("200: responds with an array of length bigger than 0", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.length;
          expect(users).toBeGreaterThan(0);
        });
    });
  });
  describe("/api/categories", () => {
    test("200: responds with an array of categories with a key of 'slug', 'description' and 'img'", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const categories = body;
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
            expect(category).toHaveProperty("img", expect.stringContaining('https://'));
          });
        });
    });
    test("200: responds with an array of length bigger than 0", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const categories = body.length;
          expect(categories).toBeGreaterThan(0);
        });
    });
  });
  describe("/api/reviews", () => {
    test("200: responds with an array of reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const reviews = body;
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty(
              "review_img_url",
              expect.stringContaining("https://")
            );
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));
            expect(review).not.toHaveProperty("review_body");
            expect(review).toHaveProperty("created_at");
            expect(review.created_at.length).toBe(24);
          });
        });
    });
    test("200: responds with an array of length bigger than 0", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.length;
          expect(reviews).toBeGreaterThan(0);
        });
    });
  });
  describe("/api/reviews?queries", () => {
    describe("/api/reviews?sort_by", () => {
      test("200: accepts a sort_by query of date, defaults to: sort_by 'created_at' in desc order", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const reviews = body;
            expect(reviews).toBeSortedBy("created_at", {
              descending: true,
              coerce: false,
            });
          });
      });
      test("400: invalid sort by query is given", () => {
        return request(app)
          .get("/api/reviews?sort_by=invalid_sort")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid sort request!");
          });
      });
    });
    describe("/api/reviews?category", () => {
      test("200: accepts a category query and returns an object with all reviews in that category", () => {
        return request(app)
          .get("/api/reviews?category=social deduction")
          .expect(200)
          .then(({ body }) => {
            const reviews = body;
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                category: "social deduction",
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("200: if no category query is specified, return all reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const reviews = body;
            reviews.forEach((review) => {
              expect(review).toMatchObject({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("404: when given an invalid category, gives an error", () => {
        return request(app)
          .get("/api/reviews?category=invalid_sort")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid category data!");
          });
      });
      test("400: when given an invalid type of category, gives an error", () => {
        return request(app)
          .get("/api/reviews?category=250")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Sort by category should be string!");
          });
      });
    });
  });
  describe("/api/review/:parametric", () => {
    test("200: GET responds with a single review object when given a number as id and it exists", () => {
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
              comment_count: expect.any(Number),
            })
          );
        });
    });
    test("404: responds with error message if requested review doesn't exist but is valid", () => {
      return request(app)
        .get("/api/reviews/2000")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Review does not exist!");
        });
    });
    test("200: GET responds with an array of reviews with category given ", () => {
      return request(app)
        .get("/api/reviews/dexterity")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([
            {
              review_id: 2,
              title: "Jenga",
              category: "dexterity",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              review_img_url:
                "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
              created_at: expect.any(String),
              votes: 5,
            },
          ]);
        });
    });

    test("400: GET invalid review_id endpoint when parametric is a string but doesn't exist in categories", () => {
      return request(app)
        .get("/api/reviews/cake")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Category doesn't exist!");
        });
    });
  });
  describe("/api/comment/:comment_id", () => {
    test("200: GET responds with a single comment object", () => {
      return request(app)
        .get("/api/comments/2")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject(
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
    test("400: GET invalid comment_id endpoint", () => {
      return request(app)
        .get("/api/comments/cake")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request!");
        });
    });
    test("404: GET responds with error message if requested comment doesn't exist but is valid", () => {
      return request(app)
        .get("/api/comments/2000")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Comment not found!");
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
          expect(body.message).toBe("Review does not exist!");
        });
    });
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
  describe("POST /api/reviews/:parametric/comments", () => {
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
        .then(({ body }) => {
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
          expect(body.message).toBe("Review does not exist!");
        });
    });

    test("400: POST responds with error message if trying to POST to a review that exist but the username given is not valid", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "cakesAreLies",
          body: "A fun afternoon! Definitely recommend!!!",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid username!");
        });
    });
  });
  describe("PATCH: /api/reviews/:parametric", () => {
    test("200: PATCH RETURNS with an object of updated review", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 1 })
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
            votes: -195,
          });
        });
    });
    test("404: if trying to PATCH to a review that doesn't exist, but is valid", () => {
      return request(app)
        .patch("/api/reviews/200")
        .send({ inc_votes: -2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Review does not exist!");
        });
    });
    test("404: if trying to PATCH to a review type that is not valid", () => {
      return request(app)
        .patch("/api/reviews/cake")
        .send({ inc_votes: -2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid review type!");
        });
    });
    test("400: error message if trying to PATCH to a review that exists but the property given is not valid", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Insert valid data!");
        });
    });
    test("400: error message if trying to PATCH to a review that exists and property to patch doesn't exist", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ key: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Insert valid data!");
        });
    });
  });
  describe("DELETE: /api/comments/:comment_id", () => {
    test("204: deletes comment by comment_id", () => {
      return request(app).delete("/api/comments/6").expect(204);
    });
  });
});
