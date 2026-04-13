const { Router } = require("express");
const indexController = require("../controllers/indexController");
const passport = require("passport");
const indexRouter = Router();

indexRouter.get("/", indexController.getAllMessages);
indexRouter.get("/login", indexController.getLogin);
indexRouter.get("/logout", indexController.logoutMember);
indexRouter.get("/sign-up", indexController.getCreateMember);
indexRouter.get("/create-message", indexController.getCreateMessage);
indexRouter.get("/upgrade", indexController.getUpgradeMember);

indexRouter.post("/sign-up", indexController.memberValidators, indexController.createMember);
indexRouter.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" }));
indexRouter.post("/create-message", indexController.messageValidators, indexController.createMessage);
indexRouter.post("/upgrade", indexController.codeValidators, indexController.upgradeMemberToPremium);
indexRouter.post("/delete/:messageId", indexController.deleteMessage);

module.exports = indexRouter;
