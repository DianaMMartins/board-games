const express = require("express");
const app = express();
const cors = require("cors");
const {
  handleCustomErrors,
  handlePSQL400s,
  handle500sErrors,
} = require("./controllers/errorHandlingControllers");
const {
  getCommentsOfReview,
  postComment,
  deleteCommentById,
  getCommentById,
  patchCommentById,
} = require("./controllers/commentsController");
const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("./controllers/reviewsController");
const { getUsers } = require("./controllers/usersControllers");
const { getCategories } = require("./controllers/categoriesController");
const foo = require("./endpoints.json");

app.use(cors());

app.use(express.json());

app.get("/api", (request, response, next) => {
  response.send(foo);
});

app.get("/api/users", getUsers);

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.get(`/api/reviews/:parametric`, getReviewById);

app.patch(`/api/reviews/:parametric`, patchReviewById);

app.post(`/api/reviews/:parametric/comments`, postComment);

app.get(`/api/reviews/:parametric/comments`, getCommentsOfReview);

app.get(`/api/comments/:comment_id`, getCommentById);

app.patch(`/api/comments/:comment_id`, patchCommentById);

app.delete(`/api/comments/:comment_id`, deleteCommentById);

app.use("*", (request, response, next) => {
  response.status(404).send({ message: "404: Path not found!" });
});
app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500sErrors);

module.exports = app;
