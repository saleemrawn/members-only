const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/queries/membersQueries");
const dbMessages = require("../db/queries/messageQueries");

const memberValidators = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha(undefined, { ignore: "'-" })
    .withMessage("First name should only contain letters, hyphen (-), apostrophe (')"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha(undefined, { ignore: "'-" })
    .withMessage("Last name should only contain letters, hyphen (-), apostrophe (')"),
  body("emailAddress")
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Email address must be a valid format e.g. john.mclane@email.com")
    .custom(async (value) => {
      const [user] = await db.findUserByEmail(value);

      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage(
      "Password must a minimum 8 characters, containing at least one number, one symbol, one lowercase character, and one uppercase character",
    ),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must match"),
];

const messageValidators = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isAlphanumeric(undefined, { ignore: " .,!?-—():;&#?£$\"'" })
    .withMessage("Message can only contain letters, numbers and .,!?-—():;&#?£$\"'"),
];

async function getAllMessages(req, res) {
  const messages = await dbMessages.getAllMessages();
  res.render("index", { title: "Members Only", messages: messages });
}

async function getCreateMember(req, res) {
  res.render("createMember", { title: "Sign Up" });
}

async function getLogin(req, res) {
  res.render("loginMember", { title: "Login" });
}

async function createMember(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("createMember", { title: "Sign Up", errors: errors.array() });
  }

  const { firstName, lastName, emailAddress, password } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.createMember({
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hashedPassword,
    membershipId: req.body.membershipStatus,
    isAdmin: req.body.isAdmin === "on" ? true : false,
  });

  res.redirect("/");
}

function logoutMember(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect("/");
}

function getCreateMessage(req, res) {
  res.render("createMessage", { title: "Create Message" });
}

async function createMessage(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("createMessage", { title: "Create Message", errors: errors.array() });
  }

  const { message } = matchedData(req);
  await dbMessages.createMessage({ message: message, authorId: req.body.authorId });

  res.redirect("/");
}

module.exports = {
  getAllMessages,
  getCreateMember,
  getLogin,
  createMember,
  logoutMember,
  getCreateMessage,
  createMessage,
  memberValidators,
  messageValidators,
};
