const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all tweets
router.get('/', async (req, res) => {
  try {
    const tweets = await db.queryAll(`
      SELECT t.*, u.username, u.name, 
      (SELECT COUNT(*) FROM likes WHERE tweet_id = t.id) as likes_count,
      (SELECT COUNT(*) FROM replies WHERE tweet_id = t.id) as replies_count,
      EXISTS(SELECT 1 FROM likes WHERE tweet_id = t.id AND user_id = ?) as liked
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `, [req.userId]);
    
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tweet
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    
    const result = await db.queryRun(
      'INSERT INTO tweets (content, user_id) VALUES (?, ?)',
      [content, req.userId]
    );
    
    const tweet = await db.queryGet(`
      SELECT t.*, u.username, u.name, 0 as likes_count, 0 as replies_count, 0 as liked
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [result.lastID]);
    
    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like tweet
router.post('/:id/like', async (req, res) => {
  try {
    const tweetId = req.params.id;
    
    // Check if already liked
    const existingLike = await db.queryGet(
      'SELECT * FROM likes WHERE tweet_id = ? AND user_id = ?',
      [tweetId, req.userId]
    );
    
    if (existingLike) {
      await db.queryRun(
        'DELETE FROM likes WHERE tweet_id = ? AND user_id = ?',
        [tweetId, req.userId]
      );
      res.json({ liked: false });
    } else {
      await db.queryRun(
        'INSERT INTO likes (tweet_id, user_id) VALUES (?, ?)',
        [tweetId, req.userId]
      );
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply to tweet
router.post('/:id/reply', async (req, res) => {
  try {
    const tweetId = req.params.id;
    const { content } = req.body;
    
    const result = await db.queryRun(
      'INSERT INTO replies (content, tweet_id, user_id) VALUES (?, ?, ?)',
      [content, tweetId, req.userId]
    );
    
    const reply = await db.queryGet(`
      SELECT r.*, u.username, u.name
      FROM replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [result.lastID]);
    
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tweet replies
router.get('/:id/replies', async (req, res) => {
  try {
    const tweetId = req.params.id;
    
    const replies = await db.queryAll(`
      SELECT r.*, u.username, u.name
      FROM replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.tweet_id = ?
      ORDER BY r.created_at DESC
    `, [tweetId]);
    
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;