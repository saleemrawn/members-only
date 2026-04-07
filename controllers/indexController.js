async function getAllMessages(req, res) {
  res.render("index", { title: "Members Only" });
}

async function getSignUp(req, res) {
  res.render("sign-up-form", { title: "Sign Up" });
}

async function getLogin(req, res) {
  res.render("login-form", { title: "Login" });
}

module.exports = { getAllMessages, getSignUp, getLogin };
