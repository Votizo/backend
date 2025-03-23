const passport = require('../../lib/passport');

module.exports = (req, res) => {
  passport.authenticate('google', {
    failureRedirect: '/',
  })(req, res, () => {
    res.redirect('https://votizo-frontend.vercel.app/');
  });
};
