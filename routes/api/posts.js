const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")
const { StatusCodes } = require("http-status-codes")
const auth = require("../../middleware/auth")

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route     GET api/post
// @desc      Post route
// @access    Public
router.post("/", [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() })
  }
  try {
    const user = await User.findById(req.user.id);

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })

    const post = await newPost.save()

    res.json(post)

  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }

})

module.exports = router
