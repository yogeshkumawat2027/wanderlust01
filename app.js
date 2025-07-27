if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(dburl);
};

main().then(() => {
  console.log("connected to DB");
}).catch((err) => {
  console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600  // if session is not change information will update 24hrs
})

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err)
})
const sessionOptions = {
  store,
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,   //only security purpose - to prevent cross scripting attach
  }
}



// app.get("/",(req,res)=>{
//     res.send("hi iam root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());  //middleware to initialize passport
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));  //use static authenticate method of model in LocalStrategy

passport.serializeUser(User.serializeUser());  // Generates a function that is used by Passport to serialize users into the session - storing info into session
passport.deserializeUser(User.deserializeUser());   //Generates a function that is used by Passport to deserialize users into the session -removes info from session


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.success);
  next();
});

// app.get("/demouser",async(req,res)=>{

//    let fakeUser = new User({
//     email : "student@gmail.com",
//     username: "delta-student"
//    });

//  let registeredUser =  await User.register(fakeUser,"Helloworld");       //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique

//  res.send(registeredUser);

// });


app.use("/listings", listingRouter);
//Reviews
app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);


app.all("*", (req, res, next) => {
  return res.redirect("/listings");  //redirect to listings page if any other route is hit
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;   //500 and something went wrong are default assign values
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});



app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});