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

module.exports = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { optionIndex } = req.body;
  try {
    await pool.query(
      'INSERT INTO votes (poll_id, user_id, option_index) VALUES ($1, $2, $3) ON CONFLICT (poll_id, user_id) DO UPDATE SET option_index = $3',
      [req.query.id, req.user.id, optionIndex]
    );
    pusher.trigger('polls', 'voteUpdate', { pollId: req.query.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
