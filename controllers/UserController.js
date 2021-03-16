const User = require("../models/User");
const Error = require("../models/Error");

const postUserSignup = async (req, res, next) => {
  console.log(req.body);

  res.json({ message: "user OK" });
};

const postUserLogin = async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
  });

  let existingUser;

  try {
    existingUser = await User.find({ email });
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

  try {
    await newUser.save();
  } catch (error) {
    return next("Something went wrong, please try again later", 500);
  }

  res.json({ message: "OK" });
};

exports.postUserSignup = postUserSignup;
exports.postUserLogin = postUserLogin;
