exports.validateObjectId = (request, response, next) => {
  const id = request.params.id;
  const hex24Regex = /^[0-9a-fA-F]{24}$/;
  if (id && !hex24Regex.test(id)) {
    return response.status(400).json({
      success: false,
      message: "Invalid ID format: Must be exactly 24 hex characters."
    });
  }
  next();
};
