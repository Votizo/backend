require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://votizo-backend-7a7n21ozn-basudev-bhandaris-projects.vercel.app/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (email, oauth_provider, oauth_id) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET oauth_id = $3 RETURNING *',
      [profile.emails[0].value, 'google', profile.id]
    );
    await pool.query(
      'INSERT INTO user_preferences (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [result.rows[0].id]
    );
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
