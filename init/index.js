const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongoUrl);
  };

  main().then(()=>{
    console.log("connected to DB");
  }).catch((err)=>{
    console.log(err);
  });

  const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj , owner :'685cc951d028920aa7333334' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };
  initDB();
  

