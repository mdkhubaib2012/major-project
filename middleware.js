const { findById: findUserById } = require("./models/user");
const listingModel = require("./models/listing.js");
const expressError = require("./utils/expressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js");

module.exports.isLoggedin = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in on Wanderlust");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await listingModel.findById(id);

    const currUser = req.user; 

 
    if (!currUser && currUser._id.equals(listing.owner._id)) {
        req.flash("error", "You don't have permission to edit any listing");
        return res.redirect(`/listings/${id}`);
    }

    next(); 
};

module.exports.isAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);


    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};

// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errMsg = error.details.map(el => el.message).join(', ');
//         throw new expressError(400, errMsg);  
//     } else {
//         next(); 
//     }
// };

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error)
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};