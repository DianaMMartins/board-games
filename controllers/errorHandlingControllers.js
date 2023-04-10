exports.handlePSQL400s = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad request!" });
  } else if (error.code === "23502") {
    response.status(400).send({ message: "Invalid property!" });
  } else if (error.code === "23503") {
    response.status(400).send({ message: "Invalid username!" });
  } else {
    next(error);
  }
};


exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "Invalid sort by request!") {
    response.status(400).send({ message: "Invalid sort request!" });
  } else if (error === "Property not found!") {
    response.status(400).send({ message: "Invalid property!" });
  } else if (error === "Invalid type in category") {
    response.status(400).send({ message: "Sort by category should be string!" });
  } else if (error === "Can't find category") {
    response.status(400).send({ message: "Category doesn't exist!" });
  } else if (error === "Can't find review") {
    response.status(404).send({ message: "Path not found!" });
  } else if (error === "Invalid data!") {
    response.status(404).send({ message: "Invalid data!" });
  } else if (error === "Invalid category") {
    response.status(404).send({ message: "Category not found!" });
  } else if (error === "Can't find comment") {
    response.status(404).send({ message: "Comment not found!" });
  } else {
    next(error);
  }
};

exports.handle500sErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "There has been a server error!" });
};
