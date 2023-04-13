const redirectLogin = (req, res, next) => {
  if (!req.session.emailID) {
    res.redirect("/Signup?val=Login");
  } else {
    next();
  }
};
module.exports = redirectLogin;
