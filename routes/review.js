const express = require("express");
const router = express.Router({mergeParams:true}); 

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// for server-side validation
const {reviewSchema} = require("../schema.js"); 

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


// reviews
// post Review Route
router.post("/", validateReview, wrapAsync(async(req, res)=>{
    console.log(req.params);
    let listing = await Listing.findById(req.params.id);
  
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review is saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);

}));

// delete Reveiew Route
router.delete("/:reviewId", async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
    
})


module.exports = router;





