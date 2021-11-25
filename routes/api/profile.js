const express = require("express")
const { StatusCodes } = require("http-status-codes")
const router = express.Router()
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")

// @route     GET api/profile/me
// @desc      Get current users profile
// @access    Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ) // user is ObjectId from ProfileSchema -- populate user model

    if (!profile) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "There is no profile for this user" })
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
})

module.exports = router
