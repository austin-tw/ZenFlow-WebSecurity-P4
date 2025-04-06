function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/error");
}

function ensureSuperUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "superuser") {
    return next();
  }
  res.redirect("/error");
}

module.exports = { ensureAuthenticated, ensureSuperUser };
