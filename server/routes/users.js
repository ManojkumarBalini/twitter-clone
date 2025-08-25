const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await db.queryGet(
      `SELECT id, username, name, email, bio, created_at,
      (SELECT COUNT(*) FROM followers WHERE follower_id = ?) as following_count,
      (SELECT COUNT(*) FROM followers WHERE following_id = ?) as followers_count
      FROM users WHERE id = ?`,
      [userId, userId, userId]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if current user is following this user
    const isFollowing = await db.queryGet(
      'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
      [req.userId, userId]
    );
    
    res.json({ ...user, is_following: !!isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow user
router.post('/:id/follow', async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    
    if (req.userId === parseInt(userIdToFollow)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if already following
    const existingFollow = await db.queryGet(
      'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
      [req.userId, userIdToFollow]
    );
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    
    await db.queryRun(
      'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
      [req.userId, userIdToFollow]
    );
    
    res.json({ following: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow user
router.delete('/:id/follow', async (req, res) => {
  try {
    const userIdToUnfollow = req.params.id;
    
    await db.queryRun(
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
      [req.userId, userIdToUnfollow]
    );
    
    res.json({ following: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user tweets
router.get('/:id/tweets', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const tweets = await db.queryAll(`
      SELECT t.*, u.username, u.name, 
      (SELECT COUNT(*) FROM likes WHERE tweet_id = t.id) as likes_count,
      (SELECT COUNT(*) FROM replies WHERE tweet_id = t.id) as replies_count,
      EXISTS(SELECT 1 FROM likes WHERE tweet_id = t.id AND user_id = ?) as liked
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, [req.userId, userId]);
    
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;