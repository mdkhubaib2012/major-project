if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express")
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const expressError = require("./utils/expressError.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


const reviewsRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js")
const userRouter = require("./routes/user.js")

const dbUrl = process.env.ATLAS_DB_URL


console.log("DB URL is: ", dbUrl);


main()
.then(()=>{
    console.log("connection successful")
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



app.get("/", (req, res) => {
    res.render("./listings/home.ejs", { currUser: req.user });
});

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("MONGO ERROR", err)
})

const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
} 



app.use(session(sessionOptions));
app.use(flash())

app.use (passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})



app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter )
app.use("/", userRouter)


app.use((req, res, next) => {
    next(new expressError(404, "Page not found"));
  });

app.use((err, req, res, next) => { 
    let{statusCode=500, message="Page not found"} = err
    res.render("error.ejs", {err})
})

app.listen(8080, () => {
    console.log("app is listening on port 8080")
});                 

