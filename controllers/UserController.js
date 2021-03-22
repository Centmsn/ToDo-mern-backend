const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const Error = require("../models/Error");

const postUserLogin = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    //   if errors is not empty that means invalid data was passed by the user
    const mapped = errors.mapped(error => error.param);
    if (mapped.password) {
      return next(new Error("Password must have 6-20 characters.", 422));
    }
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new Error("Something went wrong, please try again later", 500));
  }

  if (!existingUser) {
    return next(new Error("User does not exist", 422));
  }

  // create JWT
  let token;
  try {
    token = jwt.sign(
      {
        userID: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new Error("Something went wrong, please try again later", 500));
  }

  let isPasswordValid;

  try {
    isPasswordValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new Error("Something went wrong, please try again later ", 500)
    );
  }

  if (isPasswordValid) {
    res.json({ message: "success", userID: existingUser.id, token });
  } else {
    return next(new Error("Invalid email or password", 422));
  }
};

const postUserSignup = async (req, res, next) => {
  // express-validator errors
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  //   if errors is not empty that means invalid data was passed by the user
  if (!errors.isEmpty()) {
    const mapped = errors.mapped(error => error.param);
    if (mapped.password) {
      return next(new Error("Password must have 6-20 characters", 422));
    } else if (mapped.name) {
      return next(new Error("Name is required.", 422));
    }
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new Error("Email already taken, please choose different one.", 422)
    );
  }

  if (existingUser) {
    return res.json({
      message: "Email already taken. Please choose different one.",
    });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new Error("User not created, please try again later", 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next("Something went wrong, please try again later", 500);
  }

  res.status(201);
  res.json({ message: "success", userID: newUser.id });
};

exports.postUserSignup = postUserSignup;
exports.postUserLogin = postUserLogin;
