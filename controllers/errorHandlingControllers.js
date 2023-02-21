exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "Invalid sorting option entered!") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};
