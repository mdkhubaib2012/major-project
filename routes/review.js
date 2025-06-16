const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedin, isAuthor, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post("/", isLoggedin, validateReview, reviewController.createReview);

router.delete("/:reviewId", isLoggedin, isAuthor, reviewController.deleteReview);

module.exports = router;
