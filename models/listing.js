const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            //required: true,
        },
        coordinates: {
            type: [Number],
            //required: true,
        },
    },
});

//middleware : jab bhi listing delte ki jaye , saath he saath reviews for that particular listing bhi delete hojaye
//jaha bhi app,js mae findOneAndDelete call hogaa , usi kae sath reviews bhi delte hojayegi db se.
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;