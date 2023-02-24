exports.handlePSQL400s = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad request!" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  // if (error.status && error.message) {
  //   response.status(error.status).send({ message: `${error.message}` });
  // }
  if (error === "Invalid sorting!") {
    console.log('1');
    response.status(400).send({ message: "Invalid Request" });
  } else if (error === "Property not found!") {
    console.log('2');
    response.status(400).send({ message: "Invalid property!" });
  } else if (error === "Can't find review") { 
    console.log('3');
    response.status(404).send({ message: "Path not found!" });
  } else if (error === "Invalid data!") {
    console.log('4');
    response.status(404).send({ message: "Invalid data!" });
  } else {
    console.log('5');
    next(error);
  }
};

exports.handle500sErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ message: "There has been a server error!" });
};
