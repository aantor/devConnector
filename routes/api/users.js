const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { StatusCodes } = require("http-status-codes")

const User = require("../../models/User")

// @route     POST api/users
// @desc      Register user
// @access    Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // TODO: See if user exists
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: [{ msg: "User already exists" }] })
      }
      // TODO: Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      })
      user = new User({
        name,
        email,
        avatar,
        password,
      })
      // TODO: Encrypt password
      const salt = bcrypt.genSaltSync(10)
      user.password = bcrypt.hashSync(password, salt)

      await user.save()

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

module.exports = router
