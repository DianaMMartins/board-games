const { selectUsers } = require("../models/userModels");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};
