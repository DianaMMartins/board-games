const { selectCategories } = require("../models/gameModels");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((category) => {
      res.status(200).send(category);
    })
    .catch((err) => {
      next(err);
    });
};
