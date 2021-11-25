const jwt = require("jsonwebtoken")
const config = require("config")
const { StatusCodes } = require("http-status-codes")

module.exports = function (req, res, next) {
  // TODO: Get the token from header
  const token = req.header("x-auth-token")

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"))
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token is not valid" })
  }
}
