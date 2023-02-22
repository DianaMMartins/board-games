const { selectCategories, selectReviews , fetchReviewById} = require("../models/gameModels");

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

exports.getReviewById = (request, response, next ) => {
    const { review_id } = request.params;
    fetchReviewById(review_id).then((review) => {
        response.status(200).send({ review })
    }).catch((error) =>{
        next(error);
    })
}