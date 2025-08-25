import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received');
      return Promise.reject({ error: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ error: error.message });
    }
  }
);

export const authService = {
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
};

export const tweetService = {
  getTweets: () => {
    return api.get('/tweets')
      .then(response => response.data);
  },
  
  createTweet: (content) => {
    return api.post('/tweets', { content })
      .then(response => response.data);
  },
  
  likeTweet: (tweetId) => {
    return api.post(`/tweets/${tweetId}/like`)
      .then(response => response.data);
  },
  
  replyToTweet: (tweetId, content) => {
    return api.post(`/tweets/${tweetId}/reply`, { content })
      .then(response => response.data);
  },
  
  getReplies: (tweetId) => {
    return api.get(`/tweets/${tweetId}/replies`)
      .then(response => response.data);
  }
};

export const userService = {
  followUser: (userId) => {
    return api.post(`/users/${userId}/follow`)
      .then(response => response.data);
  },
  
  unfollowUser: (userId) => {
    return api.delete(`/users/${userId}/follow`)
      .then(response => response.data);
  },
  
  getProfile: (userId) => {
    return api.get(`/users/${userId}`)
      .then(response => response.data);
  }
};

export default api;