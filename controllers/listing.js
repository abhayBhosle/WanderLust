const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("Listings/index.ejs", { allListing });
};

//new route
module.exports.renderNewForm = (req, res) => {
    res.render("Listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing1 = await Listing.findById(id).populate({
        path: "reviews", //har ek listing kae liye uske reviews aajaye aur 
        populate: {
            path: "author",//har ek review kae liye uska author bhi aajaye 
        },
    }).populate("owner");
    if (!listing1) {
        req.flash("error", "Listing you requested for does not exist!") //flash message
        res.redirect("/listings");
    }
    //console.log(listing1);
    res.render("Listings/show.ejs", { listing1 });
};

//Create route
module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");//flash message
    res.redirect('/listings');
};

//Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing1 = await Listing.findById(id);
    if (!listing1) {
        req.flash("error", "Listing you requested for does not exist!") //flash message
        res.redirect("/listings");
    }
    let originalImageUrl = listing1.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render('Listings/edit.ejs', { listing1, originalImageUrl });
};

//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");//flash message
    res.redirect(`/listings`);
};

//Delete Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");//flash message
    res.redirect("/listings");
};