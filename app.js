const express = require("express");
const {
  handleCustomErrors,
  handlePSQL400s,
  handle500sErrors
} = require("./controllers/errorHandlingControllers");
const app = express();
const { getCategories, getReviews, getReviewById } = require("./controllers/gamesController");

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.get(`/api/reviews/:review_id`, getReviewById)

app.use('*', (request, response, next) => {
    response.status(404).send({ message: '404: Path not found!'})
})
app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500sErrors);

module.exports = app;
