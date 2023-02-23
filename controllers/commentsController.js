const {
  fetchCommentsFromReview,
  fetchReviewById,
  insertComment,
} = require("../models/gameModels");

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

exports.postComment = (request, response, next) => {
  const { review_id } = request.params;
  
  fetchReviewById(review_id)
    .then(() => {
      return insertComment(review_id, request.body);
    })
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
