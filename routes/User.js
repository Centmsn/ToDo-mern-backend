const { Router } = require("express");

const UserController = require("../controllers/UserController");

const router = Router();

router.post("/signup", UserController.postUserSignup);

router.post("/login", UserController.postUserLogin);

module.exports = router;
