# 🐦 Twitter Clone (Backend)

A **Twitter Clone** project built using **Express.js** and **SQLite** with **JWT Authentication**.  
This project demonstrates how to design and build RESTful APIs for a social media platform where users can register, login, follow others, post tweets, like tweets, and reply to tweets.


## 🚀 Features
- 🔐 User authentication with **JWT**
- 👥 Follow/unfollow other users
- 📝 Post, like, and reply to tweets
- 📄 View user tweets, likes, and replies
- 📊 Explore followers and following lists
- 🗄️ Data stored in **SQLite**



## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Token)



## 📂 Project Structure
```

twitter-clone/
├── server/
│   ├── app.js          # Main application file
│   ├── database.js     # SQLite database connection
│   ├── middlewares/    # JWT authentication middleware
│   ├── routes/         # API route handlers
│   ├── package.json    # Dependencies & scripts
│   └── ...
└── README.md



⚙️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/twitter-clone.git
   cd twitter-clone/server
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run database migrations (if any)**

   ```bash
   # Example: create database file
   sqlite3 twitterClone.db < schema.sql
   ```

4. **Start the server**

   ```bash
   node app.js
   ```



## 🔑 API Endpoints

### Authentication

* `POST /register/` → Register a new user
* `POST /login/` → Login and get JWT token

### Tweets

* `POST /user/tweets/` → Create a tweet
* `GET /user/tweets/` → Get all tweets of logged-in user
* `DELETE /tweets/:tweetId/` → Delete a tweet

### Social

* `GET /user/following/` → List of users the logged-in user follows
* `GET /user/followers/` → List of users following the logged-in user

### Interactions

* `POST /tweets/:tweetId/like/` → Like a tweet
* `POST /tweets/:tweetId/reply/` → Reply to a tweet
* `GET /tweets/:tweetId/` → Get tweet details



## 📌 Environment Variables

Create a `.env` file in the `server` folder:


JWT_SECRET=your_secret_key
PORT=3000




## 🧪 Testing

Use **Postman** or **cURL** to test the API endpoints with authentication.



## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.



##📜 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

* **Manoj Kumar**
  🚀 Full Stack Developer | AI/ML Enthusiast
  🌐 [GitHub](https://github.com/ManojkumarBalini)
