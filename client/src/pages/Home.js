import React, { useState, useEffect } from 'react';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';
import { tweetService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadTweets();
  }, []);

  const loadTweets = async () => {
    try {
      const data = await tweetService.getTweets();
      setTweets(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load tweets');
      setLoading(false);
    }
  };

  const handleNewTweet = (tweet) => {
    setTweets([tweet, ...tweets]);
  };

  const handleLike = async (tweetId) => {
    try {
      const result = await tweetService.likeTweet(tweetId);
      setTweets(tweets.map(tweet => 
        tweet.id === tweetId 
          ? { 
              ...tweet, 
              likes_count: result.liked ? tweet.likes_count + 1 : tweet.likes_count - 1,
              liked: result.liked 
            } 
          : tweet
      ));
    } catch (error) {
      setError('Error liking tweet');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading tweets...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body text-center">
            <h5 className="card-title">Welcome to Twitter Clone</h5>
            <p className="card-text">Share what's happening in your world!</p>
          </div>
        </div>
        
        <TweetForm onTweet={handleNewTweet} />
        <TweetList tweets={tweets} onLike={handleLike} />
      </div>
    </div>
  );
};

export default Home;