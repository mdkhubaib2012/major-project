const express = require("express")
const router = express.Router()
const { isLoggedin, isOwner, validateListing } = require("../middleware.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })
const listingController = require("../controllers/listings.js")
const listing = require("../models/listing");


// index route
router
.route("/")
.get((listingController.index))
.post(upload.single('listing[image]'),   (listingController.createlisting))
// new route
router.get("/new", isLoggedin, listingController.renderNewForm);

// show route
router.route("/:id")
.get((listingController.showListing))
.put(isLoggedin, isOwner, upload.single('listing[image]'), (listingController.updatelisting))
.delete( isLoggedin, isOwner, (listingController.deletelisting))

// edit
router.get("/:id/edit", isLoggedin, isOwner, (listingController.editlisting));

module.exports = router