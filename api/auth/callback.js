const passport = require('../../lib/passport');

module.exports = (req, res) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
    // Set a simple cookie instead of session
    res.cookie('user_id', user.id, { httpOnly: true, secure: true });
    res.redirect('https://votizo-frontend.vercel.app/');
  })(req, res);
};
