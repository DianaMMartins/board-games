const {
  selectReviews,
  fetchReviewById,
  selectCategoriesFromReviews,
} = require("../models/gameModels");

exports.getReviews = (request, response, next) => {
  let { category, sort_by, order } = request.query;
  // const validateCategories = selectCategoriesFromReviews();
  // Promise.all([validateCategories]).then(([categories])=>{
  //   categories.forEach((property) =>{
  //     if (!Object.values(property)[0] === category) {
  //       console.log(category, property);
  //       return Promise.reject('Invalid category')
  //     }
  //   })
  // })
  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order !== "ASC") {
    order = "DESC";
  }

  selectReviews(category, sort_by, order)
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
      if (inc_votes === undefined) {
        return Promise.reject("Property not found!");
      }

      review.votes = review.votes + inc_votes;

      if (Math.sign(inc_votes) === -1 && review.votes < 0) {
        review.votes = 0;
      }
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
