exports.handlePSQL400s = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad request!" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "Invalid sorting!") {
    response.status(400).send({ message: "Invalid Request" });
  } else if (error === "Can't find review") {
    response.status(404).send({ message: "Path not found!" });
  } else {
    next(error);
  }
};

exports.handle500sErrors = (error, request, response, next) => {
  response.status(500).send({ message: "There has been a server error!" });
};
