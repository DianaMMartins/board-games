const express = require("express");
const {
  handleCustomErrors,
} = require("./controllers/errorHandlingControllers");
const app = express();
const { getCategories, getReviews } = require("./controllers/gamesController");

app.get("/api/categories", getCategories);

app.get(`/api/reviews`, getReviews);

app.use(handleCustomErrors);
app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "There has been a server error!" });
});

module.exports = app;
