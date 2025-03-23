const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (poll_id, user_id, email, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.query.id, req.user.id, req.user.email, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
