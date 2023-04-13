const redirectDash = (req, res, next) => {
  if (req.session.emailID) {
    res.redirect("/Dashboard");
  } else {
    next();
  }
};
module.exports = redirectDash;
