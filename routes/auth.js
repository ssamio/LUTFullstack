//Router for authentication and authorization
var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//Validators for password and email stored as return values
const emailValidate = () => body("email").isEmail().normalizeEmail();
const passwordValidate = () =>
  body("password").trim().escape().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

//POST for registering user, also logs the user in by providing a JWT token in the process
router.post(
  "/register",
  emailValidate(),
  passwordValidate(),
  async (req, res) => {
    //Validate email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Credential validation error" });
    }

    const emailQuery = await User.findOne({ email: req.body.email }).exec();
    const usernameQuery = await User.findOne({
      username: req.body.username,
    }).exec();
    if (emailQuery || usernameQuery) {
      return res.status(403).json({ error: "Duplicate error" });
    } else {
      let username;
      if (!req.body.username) {
        username = req.body.email;
      } else {
        username = req.body.username;
      }
      await User.create({
        email: req.body.email,
        username: username,
        password: req.body.password,
      }).then((ok) => {
        if (!ok) {
          return res.status(500).json({ error: "Failure" });
        } else {
          User.findOne({ email: req.body.email })
            .exec()
            .then((user) => {
              const token = jwt.sign(
                {
                  email: user.email,
                  id: user._id,
                  username: user.username,
                  adminStatus: user.adminStatus,
                },
                process.env.SECRET,
                {
                  expiresIn: "1h",
                },
              );
              return res.status(200).json({ token });
            });
        }
      });
    }
  },
);

//POST for logging in. If succesful, return the JWT token to the client
router.post("/login", emailValidate(), passwordValidate(), async (req, res) => {
  //Validate email and password
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  try {
    const { email, password } = req.body;

    User.findOne({ email: email })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(400).json({ error: "Invalid credentials" });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            } else if (!isMatch) {
              return res.status(400).json({ error: "Invalid credentials" });
            } else {
              const token = jwt.sign(
                {
                  email: user.email,
                  id: user._id,
                  username: user.username,
                  adminStatus: user.adminStatus,
                },
                process.env.SECRET,
                {
                  expiresIn: "1h",
                },
              );
              res.status(200).json({ token });
            }
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
