const { selectCategories, selectReviews } = require("../models/gameModels");

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((category) => {
      response.status(200).send(category);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviews = (request, response, next) => {
  const { sort_by } = request.query;

  selectReviews(sort_by)
    .then((reviews) => {
      response.status(200).send(reviews);
    })
    .catch((error) => {
      next(error);
    });
};
