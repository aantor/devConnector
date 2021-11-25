const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const { StatusCodes } = require("http-status-codes")

// @route     GET api/auth
// @desc      Auth route
// @access    Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
})

module.exports = router
