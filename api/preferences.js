const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { theme } = req.body;
  try {
    await pool.query('UPDATE user_preferences SET theme = $1 WHERE user_id = $2', [theme, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
