require("dotenv").config();
const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routers/indexRouter");
const errorRouter = require("./routers/errorRouter");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queries/membersQueries");
const bcrypt = require("bcryptjs");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

passport.use(
  new LocalStrategy({ usernameField: "emailAddress" }, async (emailAddress, password, done) => {
    try {
      const [user] = await db.findUserByEmail(emailAddress);

      if (!user) {
        return done(null, false, { message: "Incorrect email address" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/{*splat}", errorRouter);
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).render("customError", {
    title: `${err.statusCode || 500} | ${err.message}`,
    error: { statusCode: err.statusCode || 500, message: err.message },
  });
});

app.listen(8080, (error) => {
  if (error) {
    throw error;
  }

  console.log("App listening on port 8080");
});
