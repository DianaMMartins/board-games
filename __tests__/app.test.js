const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe.only("app", () => {
  describe("/api/categories", () => {
    test("200: responds with an array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((body) => {
          const categories = body.body;
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
        });
    });
    test("200: accepts a sort_by query of date in descending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const reviews = body;
          expect(reviews.length).toBeGreaterThan(0);
          const reviewsCopyArray = [...reviews];
          const sortedReviews = reviewsCopyArray.sort((reviewA, reviewB) => {
            // console.log(reviewA.created_at.substr(0, 10), 'a' , reviewB.created_at, 'b');
            const reviewOne = reviewA.created_at.substr(0, 10);
            const reviewTwo = reviewB.created_at.substr(0, 10);
            if (reviewOne > reviewTwo) {
              return -1;
            } else if (reviewOne < reviewTwo) {
              return 1;
            } else {
              return 0;
            }
          });
          expect(sortedReviews).toEqual(reviews);
        });
    });
  });
  test("400: invalid sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid_sort")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
