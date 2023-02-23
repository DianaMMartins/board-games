const { selectCategories } = require('../models/gameModels')

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((category) => {
      response.status(200).send(category);
    })
    .catch((error) => {
      next(error);
    });
};