const { selectReviews, fetchReviewById } = require("../models/gameModels");

exports.getReviews = (request, response, next) => {
  const { sort_by } = request.query;

//select_category //if none give all reviews
//sort_by should sort by any column default of date
//order can be asc or desc
  console.log(sort_by);
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

exports.patchReviewById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { review_id } = request.params;

  fetchReviewById(review_id)
    .then((review) => {
      if ( inc_votes === undefined) {
        return Promise.reject('Property not found!')
      }
      review.votes += inc_votes;
      if (Math.sign(inc_votes) === -1 && review.votes < 0) {
        review.votes = 0;
      }
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
