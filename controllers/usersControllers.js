exports.getUsers = (request, response, next) => {
    selectUsers()
      .then((user) => {
        console.log(user);
        response.status(200).send(user);
      })
      .catch((error) => {
        next(error);
      });
  };