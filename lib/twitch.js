const axios = require('axios');
const config = require('../config');

class TwitchAPI {
  constructor() {
    this.baseURL = 'https://api.twitch.tv/helix';
    this.accessToken = null;
  }

  async getAccessToken() {
    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: config.twitch.clientId,
        client_secret: config.twitch.clientSecret,
        grant_type: 'client_credentials'
      });
      
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Twitch access token:', error.message);
      throw error;
    }
  }

  async getStreamInfo(username) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    try {
      const response = await axios.get(`${this.baseURL}/streams`, {
        headers: {
          'Client-ID': config.twitch.clientId,
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          user_login: username
        }
      });

      return response.data.data[0] || null;
    } catch (error) {
      console.error(`Failed to get stream info for ${username}:`, error.message);
      return null;
    }
  }
}

module.exports = TwitchAPI;