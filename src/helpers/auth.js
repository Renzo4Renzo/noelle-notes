const helpers = {};

helpers.isAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }
  request.flash("failure_message", "Not Authorized! Please log in to your account!");
  response.redirect("/users/login");
};

module.exports = helpers;
