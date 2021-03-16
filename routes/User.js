const { Router } = require("express");
const { check } = require("express-validator/check");

const UserController = require("../controllers/UserController");

const router = Router();

router.post(
  "/signup",
  [
    check("password").isLength({ min: 6, max: 20 }),
    check("name").not().isEmpty(),
  ],
  UserController.postUserSignup
);

router.post("/login", UserController.postUserLogin);

module.exports = router;
