const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const path = require("path");

const session = require("express-session");
const flash = require("connect-flash");

//To Use Express Router
const listingspr = require("./routes/listing.js"); 
const reviews = require("./routes/review.js");

const app = express();   
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate); 
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.listen(port, () => {
    console.log("app is listening at port 8080...");
});

const sessionOptions = {
    secret : "myverysecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,     // in milli-sec
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.send("hi, this is root");
})

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(Mongo_URL);
}

main().then((res) => {
    console.log("connected to database");
}).catch((err) => {
    console.log("error in connection");
})


//
app.use("/listings", listingspr);
app.use("/listings/:id/reviews", reviews);


//// for all other route
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));

})

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs",{err});
})





// app.get("/getListing", (req, res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "well furshnished, sea facing villa",
//         price : 1500,
//         location : "Goa",
//         country : "India"
//     });

//     sampleListing.save();
//     res.send("data is saved into mongodb");
//     console.log("data is saved");
// })


// not a custom error
// app.use((err, req, res, next)=>{
//     res.send("Something went wrong!");
// })



