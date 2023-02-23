const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handlePSQL400s,
  handle500sErrors,
} = require("./controllers/errorHandlingControllers");
const {
  getCommentsOfReview,
  postComment,
} = require("./controllers/commentsController");
const {
  getReviews,
  getReviewById,
} = require("./controllers/reviewsController");
const { getCategories } = require("./controllers/categoriesController");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.get(`/api/reviews/:review_id`, getReviewById);

app.post(`/api/reviews/:review_id/comments`, postComment);

app.get(`/api/reviews/:review_id/comments`, getCommentsOfReview);

app.use("*", (request, response, next) => {
  response.status(404).send({ message: "404: Path not found!" });
});
app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500sErrors);

module.exports = app;
