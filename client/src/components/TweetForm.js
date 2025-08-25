import React, { useState } from 'react';
import { tweetService } from '../services/api';

const TweetForm = ({ onTweet }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }
    
    if (content.length > 280) {
      setError('Tweet cannot exceed 280 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const newTweet = await tweetService.createTweet(content);
      onTweet(newTweet);
      setContent('');
    } catch (error) {
      setError('Failed to post tweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Compose Tweet</h5>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          {error && <div className="error-message mb-2">{error}</div>}
          <div className="d-flex justify-content-between align-items-center">
            <span className={`text-muted ${content.length > 280 ? 'text-danger' : ''}`}>
              {content.length}/280
            </span>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!content.trim() || content.length > 280 || loading}
            >
              {loading ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetForm;