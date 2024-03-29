const {
  selectReviews,
  fetchReviewById,
  updateReviewById,
  fetchReviewByCategory,
} = require("../models/reviewsModels");
const {
  selectCategories,
  selectCategoriesFromReviews,
} = require("../models/categoriesModels");

exports.getReviews = (request, response, next) => {
  let { category, sort_by, order } = request.query;

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
  const { parametric } = request.params;
  const regEx = /\d/g;
  if (regEx.test(parametric)) {
    fetchReviewById(parametric)
      .then((review) => {
        response.status(200).send({ review });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    selectCategories()
      .then((categoriesRes) => {
        return categoriesRes;
      })
      .then((categories) => {
        fetchReviewByCategory(parametric, categories)
          .then((reviews) => {
            response.status(200).send(reviews);
          })
          .catch((error) => {
            next(error);
          });
      });
  }
};

exports.patchReviewById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { parametric } = request.params;

  updateReviewById(parametric, inc_votes)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
