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
    // console.log(1);
    response.status(400).send({ message: "Invalid sort request!" });
  } else if (error === "Property not found!") {
    // console.log(2);
    response.status(400).send({ message: "Invalid property!" });
  } else if (error === "Invalid type in category") {
    // console.log(3);
    response.status(400).send({ message: "Sort by category should be string!" });
  } else if (error === "Can't find category") {
    // console.log(4);
    response.status(400).send({ message: "Category doesn't exist!" });
  } else if (error === "Vote property is invalid") {
    console.log(5);
    response.status(400).send({ message: "Insert valid data!" });
  } else if (error === "Can't find review") {
    // console.log(6);
    response.status(404).send({ message: "Review does not exist!" });
  } else if (error === "Invalid data!") {
    // console.log(7);
    response.status(404).send({ message: "Invalid data!" });
  } else if (error === "Invalid category") {
    // console.log(8);
    response.status(404).send({ message: "Invalid category data!" });
  } else if (error === "Review not valid") {
    // console.log(9);
    response.status(404).send({ message: "Invalid review type!" });
  } else if (error === "Comment not valid") {
    // console.log(10);
    response.status(404).send({ message: "Invalid comment type!" });
  } else if (error === "Can't find comment") {
    // console.log(11);
    response.status(404).send({ message: "Comment not found!" });
  } else {
    next(error);
  }
};

exports.handle500sErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "There has been a server error!" });
};
