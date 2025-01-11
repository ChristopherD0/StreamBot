require('dotenv').config();

module.exports = {
  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY
  },
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/streambot'
  },
  server: {
    port: process.env.PORT || 3000
  }
};