const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");

describe("app", () => {
  describe("/api", () => {
    test('200: GET responds with a message of connection', () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe('Connected');
        });
    });
  });
});
