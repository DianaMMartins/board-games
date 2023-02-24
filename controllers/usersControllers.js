const { selectUsers } = require("../models/userModels");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((user) => {
      response.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};
