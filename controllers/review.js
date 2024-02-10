const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;//this person will become the author of the new review
    //console.log(newReview);
    listing.reviews.push(newReview);//array in lising model
    await newReview.save();
    await listing.save();
    req.flash("success","New Reviews Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // listing mae review naam ka array hae , usme se bhi reviews ki id delete hone
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Reveiw Deleted!");
    res.redirect(`/listings/${id}`);
};