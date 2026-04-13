const { Router } = require("express");
const errorRouter = Router();

errorRouter.get("/", (req, res) => {
  res.status(404).render("customError", { title: "404 | Not found", error: { statusCode: 404, message: "Resource not found" } });
});

module.exports = errorRouter;
