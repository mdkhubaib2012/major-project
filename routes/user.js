const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get( (userController.signup))
.post( (userController.signupPath));

router.route("/login")
.get( (userController.login))
.post( saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect: "/signup", failureFlash: true, }),
    (userController.loginPath));

router.get("/logout", (userController.logout) );

module.exports = router;
