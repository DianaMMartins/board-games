const {
  selectCategories,
  selectReviews,
  fetchReviewById,
  fetchCommentsFromReview,
} = require("../models/gameModels");

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

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsOfReview = (request, response, next) => {
  const { review_id } = request.params;
  const review = fetchReviewById(review_id);
  const comment = fetchCommentsFromReview(review_id);
  Promise.all([review, comment])
    .then((result) => {
      const arrayOfComments = result[1];
      response.status(200).send({ comments: arrayOfComments });
    })
    .catch((error) => {
      next(error);
    });
};
