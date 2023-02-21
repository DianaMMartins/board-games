const express = require("express");
const {
  handleCustomErrors,
} = require("./controllers/errorHandlingControllers");
const app = express();
const { getCategories, getReviews, getReviewById } = require("./controllers/gamesController");

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.get(`/api/reviews/:review_id`, getReviewById)

app.use('*', (request, response, next) => {
    response.status(404).send({ message: '404: Path not found!'})
})
app.use(handleCustomErrors);
app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "There has been a server error!" });
});

module.exports = app;
