const express = require("express")
const router = express.Router()
const { StatusCodes } = require("http-status-codes")
const { check, validationResult } = require("express-validator/check")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs")

const auth = require("../../middleware/auth")
const User = require("../../models/User")

// @route     GET api/auth
// @desc      Get authenticated user's info
// @access    Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
})

// @route     POST api/auth
<<<<<<< HEAD
// @desc      Authenticate (Login) user & get token
=======
// @desc      Authenticate user & get token
>>>>>>> 2ae9cacfe72840c59735d717a11b449783e1c038
// @access

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
<<<<<<< HEAD
    check("password", "Password is required").exists(),
=======
    check("password", "Please is required").exists(),
>>>>>>> 2ae9cacfe72840c59735d717a11b449783e1c038
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // TODO: See if user exists
      let user = await User.findOne({ email })

      if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: [{ msg: "Invalid credentials" }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: [{ msg: "Invalid credentials" }] })
      }

      // TODO: Return jwonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
    }
  }
)

<<<<<<< HEAD
module.exports = router
=======
module.exports = router
>>>>>>> 2ae9cacfe72840c59735d717a11b449783e1c038
