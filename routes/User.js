const { Router } = require("express");
const { check } = require("express-validator/check");

const UserController = require("../controllers/UserController");

const router = Router();

// create user
router.post(
  "/signup",
  [
    check("password").isLength({ min: 6, max: 20 }),
    check("name").not().isEmpty(),
  ],
  UserController.postUserSignup
);

// login user
router.post(
  "/login",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 6, max: 20 }),
  ],
  UserController.postUserLogin
);

module.exports = router;
