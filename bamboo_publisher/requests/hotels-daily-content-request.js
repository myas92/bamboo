require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('../utils/generate-hash');
const { refresherApiKey } = require('../utils/refresher-api-key');
const { validateResponse } = require('../utils/validate');

const getDailyHotelsContentByRequest = async ({ from, to, lastUpdateTime }) => {
  try {
    const { token, secret } = await refresherApiKey()
    if (!token) {
      return { data: null, error: 'API KEY is invalid' }
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: process.env.API_URL_HOTELS_INFO,
      headers: {
        'Api-key': token,
        'X-Signature': generateHash(token, secret),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      params: {
        from: from,
        to: to,
        language: 'ENG',
        fields: 'all',
        lastUpdateTime: lastUpdateTime,
        useSecondaryLanguage:false
      },
      timeout: process.env.API_TEIMEOUT
    };

    const response = await axios.request(config);
    if (!validateResponse(response)) {
      throw new Error('Response Request is invalid')
    }
    return {
      data: response.data,
      total: response.data.total,
      responseHeader: {
        totalRequest: +response.headers['x-ratelimit-limit'],
        remainder: +response.headers['x-ratelimit-remaining'],
      },
      isValid: true,
      error: null
    }

  } catch (error) {
    console.error(error.message)
    return {
      data: null, total: 0, error, isValid: false
    }
  }

}

module.exports = {
  getDailyHotelsContentByRequest
}