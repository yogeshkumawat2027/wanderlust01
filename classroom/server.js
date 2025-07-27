const express = require("express");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");

const path = require("path");

 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));


const sessionOptions = { 
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true
 }
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name = "Anonymous"} = req.query;
    req.session.name = name;
    if(name === "Anonymous"){
        req.flash("error", "Some error occured");
    }
    else{
        req.flash("success", "User successfuly registered");
    }
    
    console.log(req.session);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name : req.session.name});
})




















// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`req count is ${req.session.count}`);
// })




// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));

// app.get("/",(req,res)=>{
//      console.dir(req.cookies);
//     res.send("I am root");
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in" , "India", {signed : true});
//     res.send("Done");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/greet",(req,res)=>{
//     let {name = "anonymous" } = req.cookies;
//     res.send(`Hi , ${name}`);
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("Greet" , "Hello");
//     res.send("We sent you cookie");
// })

app.listen(3000,()=>{
    console.log("server is listenning to port 3000");
})