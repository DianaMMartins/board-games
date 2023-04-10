const {
  fetchCommentsById,
  removeCommentById,
  fetchCommentsFromReview,
  insertComment
} = require("../models/commentModels");
const {
  fetchReviewById,
  } = require("../models/reviewsModels");

exports.getCommentsOfReview = (request, response, next) => {
  const { parametric } = request.params;
  const review = fetchReviewById(parametric);
  const comment = fetchCommentsFromReview(parametric);
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
  const { parametric } = request.params;
  const receivedComment = request.body;

  fetchReviewById(parametric)
    .then(() => {
      return insertComment(parametric, receivedComment);
    })
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  fetchCommentsById(comment_id)
    .then((returnObj) => {
      response.status(200).send(returnObj);
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  fetchCommentsById(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then((deletedComment) => {
      response.status(204).send(null);
    })
    .catch((error) => {
      next(error);
    });
};
