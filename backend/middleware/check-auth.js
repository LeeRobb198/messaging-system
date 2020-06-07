const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_a_long_string");
    request.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    response.status(401).json({
      message: "Auth failed"
    });
  }
};
