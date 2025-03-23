const passport = require('../../lib/passport');

module.exports = (req, res) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};
