const Review = require("../models/review.js");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    if (!req.user) {
        console.error("User not found in request. Are you logged in?");
        req.flash('error', 'You must be logged in to leave a review.');
        return res.redirect(`/listings/${id}`);
    }

    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};
