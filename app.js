const express = require("express");
const app = express();
const cors = require('cors')
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
  patchReviewById,
} = require("./controllers/reviewsController");
const { getUsers } = require("./controllers/usersControllers");
const { getCategories } = require("./controllers/categoriesController");

app.use(cors());

app.use(express.json());

app.get("/api/users", getUsers);

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.get(`/api/reviews/:review_id`, getReviewById);

app.patch(`/api/reviews/:review_id`, patchReviewById);

app.post(`/api/reviews/:review_id/comments`, postComment);

app.get(`/api/reviews/:review_id/comments`, getCommentsOfReview);

app.use("*", (request, response, next) => {
  response.status(404).send({ message: "404: Path not found!" });
});
app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500sErrors);

module.exports = app;