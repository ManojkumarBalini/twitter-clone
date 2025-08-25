import React from 'react';

const TweetList = ({ tweets, onLike }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleLike = async (tweetId) => {
    try {
      await onLike(tweetId);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  if (tweets.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <p>No tweets yet. Be the first to tweet!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {tweets.map(tweet => (
        <div key={tweet.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5 className="card-title">{tweet.name} <small className="text-muted">@{tweet.username}</small></h5>
              <small className="text-muted">{formatDate(tweet.created_at)}</small>
            </div>
            <p className="card-text">{tweet.content}</p>
            <div className="tweet-actions">
              <button 
                className={`tweet-action-btn ${tweet.liked ? 'text-primary' : 'text-muted'}`}
                onClick={() => handleLike(tweet.id)}
              >
                <i className={`fas fa-heart ${tweet.liked ? 'text-danger' : ''}`}></i>
                <span>{tweet.likes_count}</span>
              </button>
              <button className="tweet-action-btn text-muted">
                <i className="fas fa-reply"></i>
                <span>{tweet.replies_count}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TweetList;