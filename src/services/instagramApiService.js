const axios = require('axios');
const logger = require('../utils/logger');

class InstagramApiService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,instagram_business_account'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      logger.error('خطا در تست API اینستاگرام:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async getAccountInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/${process.env.INSTAGRAM_USER_ID}`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,username,profile_picture_url'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      logger.error('خطا در دریافت اطلاعات اکانت:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = { InstagramApiService };
