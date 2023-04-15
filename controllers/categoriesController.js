const { selectCategories } = require("../models/categoriesModels");

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((categories) => {
      console.log(categories, 'back end get categories');
      response.status(200).send(categories);
    })
    .catch((error) => {
      next(error);
    });
};
