const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.getAllMessages);
indexRouter.get("/login", indexController.getLogin);
indexRouter.get("/sign-up", indexController.getSignUp);

module.exports = indexRouter;
