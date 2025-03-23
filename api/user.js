const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (req.user) {
    try {
      const pref = await pool.query('SELECT theme FROM user_preferences WHERE user_id = $1', [req.user.id]);
      res.json({ ...req.user, preferences: { theme: pref.rows[0]?.theme || 'dark' } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};
