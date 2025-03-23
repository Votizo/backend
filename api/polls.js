const { Pool } = require('pg');
const Pusher = require('pusher');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

module.exports = {
  GET: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM polls ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  POST: async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const { question, options, expiresAt, category } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO polls (question, options, expires_at, created_by, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [question, options, expiresAt, req.user.email, category]
      );
      pusher.trigger('polls', 'pollCreated', result.rows[0]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
