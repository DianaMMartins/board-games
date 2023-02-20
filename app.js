const express = require("express");
const app = express();
const { getCategories } = require("./controllers/gamesController");

app.get("/api", (req, res, next) => {
  res.status(200).send({ msg: "Connected" });
});

app.get("/api/categories", getCategories);

module.exports = app;
