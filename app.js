require("dotenv").config();
const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routers/indexRouter");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use("/", indexRouter);

app.listen(8080, (error) => {
  if (error) {
    throw error;
  }

  console.log("App listening on port 8080");
});
