const passport = require('passport');

module.exports.protectRoute = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    return res.send('not authenticated ,please login');
  }