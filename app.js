require('dotenv').config();

const path = require("path");
const express = require("express");
const connectDB = require("./config/database");


const expresslayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const authRoute = require("./routes/auth");
const feedRoute = require("./routes/feed");
const postRoute = require("./routes/post");
const userRoute = require('./routes/user');

const app = express();

connectDB();

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });
  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "./layouts/layout");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session ? req.session.user : null;
  next();
});

app.use(expresslayouts);
app.use(authRoute);
app.use(feedRoute);
app.use(postRoute);
app.use(userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
})