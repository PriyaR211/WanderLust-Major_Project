const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// for server-side validation
const {listingSchema} = require("../schema.js"); 


// server side schema validation using middleware
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


// home page - Index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find(); 
    res.render("listings/index.ejs", { allListings });
}));


//New route(to add new docs)
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("review");
    console.log(listing);
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));


// create route (validteListing->providing server side validation)
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// updating docs
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate((id), { ...req.body.listing });
    console.log({ ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


// delete document
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedDocs = await Listing.findByIdAndDelete(id);
    console.log(deletedDocs);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;



