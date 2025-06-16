const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing
        .findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('owner');

    if (!foundListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing: foundListing });
};

module.exports.createlisting = async (req, res) => {
    try {
        const geoResponse = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        const geometry = geoResponse.body.features[0]?.geometry;

        if (!geometry) {
            req.flash("error", "Invalid location provided.");
            return res.redirect("/listings/new");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            newListing.image = { url, filename };
        }

        newListing.geometry = geometry;

        await newListing.save();
        req.flash("success", "New listing created successfully!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings/new");
    }
};


module.exports.editlisting = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);

    if (!foundListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    let originalImageUrl = foundListing.image.url;;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250")

    res.render("listings/edit.ejs", { listing: foundListing , originalImageUrl});
};

module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings/");
};
