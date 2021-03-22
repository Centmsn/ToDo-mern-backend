const HttpError = require("../models/Error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    return next(new HttpError("Token is not valid", 401));
  }
  token = token.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return next(
      new HttpError("Could not verify token. Try to login again", 500)
    );
  }

  if (!decodedToken) {
    return next(new HttpError("Token is not valid", 401));
  }

  req.userId = decodedToken.userID;
  next();
};
