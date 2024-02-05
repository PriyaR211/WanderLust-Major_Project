const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");


const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(Mongo_URL);
}

main().then((res)=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("error in connection");
})

async function initDB(){
    console.log("Inside init database function");
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Outside init database function");
}

initDB();





