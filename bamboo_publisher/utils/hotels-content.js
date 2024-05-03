require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('./generate-hash');
const { refresherApiKey } = require('./refresher-api-key');
const { validateResponse } = require('./validate');

const getHotelsContentByRequest = async ({ from, to }) => {
  try {
    const { token, secret } = await refresherApiKey()
    if (!token) {
      return { data: null, error: 'API KEY is invalid', from, to }
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&language=ENG&from=${from}&to=${to}`,
      headers: {
        'Api-key': token,
        'X-Signature': generateHash(token, secret),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
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
      from, to, error: null
    }

  } catch (error) {
    console.error(error.message)
    return {
      data: null, total: 0, error, isValid: false, from, to
    }
  }

}

module.exports = {
  getHotelsContentByRequest
}