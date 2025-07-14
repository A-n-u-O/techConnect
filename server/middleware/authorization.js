const jwt = require("jsonwebtoken");
require("dotenv").config();

//check if the token being sent is valid
function authorization(req, res, next) {
  //get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Received token", token);
  if (!token) {
    return res.status(403).json({
      error: "Authorization denied",
      message: "No authentication token provided",
    });
  }
  try {
    //verify token
    const payload = jwt.verify(token, process.env.jwtSecret);
    console.log("Decoded payload:", payload);
    //validate payload structure
    if (!payload.user || !payload.user.id) {
      return res.status(401).json({
        error: "Invalid token",
        message: "Malformed authentication token",
      });
    }

    req.user = payload.user;
    next();
  } catch (error) {
    console.error("JWT Verification Error", error.message);
    const errorResponse = { error: "Invalid token", details: null };

    if (error.name === "TokenExpiredError") {
      errorResponse.error = "Token expired";
      errorResponse.details = { expiredAt: error.expiredAt };
    } else if (error.name === "JsonWebTokenError") {
      errorResponse.error = "JWT error";
      errorResponse.details = error.message;
    }

    res.status(401).json({
      error: "Authentication failed",
      message: errorResponse,
    });
  }
}
module.exports = authorization;
