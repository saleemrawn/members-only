const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.getAllMessages);
indexRouter.get("/login", indexController.getLogin);
indexRouter.get("/sign-up", indexController.getCreateMember);

indexRouter.post("/sign-up", indexController.memberValidators, indexController.createMember);

module.exports = indexRouter;
