const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const prefResult = await pool.query('SELECT theme FROM user_preferences WHERE user_id = $1', [userId]);
    if (!userResult.rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({
      ...userResult.rows[0],
      preferences: { theme: prefResult.rows[0]?.theme || 'dark' },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
