const { selectCategories, selectReviews } = require("../models/gameModels");

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((category) => {
        console.log(category);
      response.status(200).send(category);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviews = (request, response, next) => {
  selectReviews()
    .then((review) => {
      response.status(200).send(review);
    })
    .catch((error) => {
      next(error);
    });
};