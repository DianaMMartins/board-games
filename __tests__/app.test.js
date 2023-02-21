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
  test("400: invalid sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid_sort")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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
  describe("/api/snacks/:snack_id", () => {
    test("200: GET responds with a single review object", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
                review_id: 2,
                title: 'Jenga',
                category: 'dexterity',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_body: 'Fiddly fun for all the family',
                review_img_url: 'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 5
          });
        });
    });
  });
});

//test for 404 bad path misspelled
