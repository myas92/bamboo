require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('./generate-hash');
const { refresherApiKey } = require('./refresher-api-key');
const { validateResponse } = require('./validate');

const getTotalHotelsByRequest = async () => {
  try {
    const { token, secret } = await refresherApiKey()
    if (!token) {
      return { data: null, error: 'Does not exist any valid API KEY'}
    }
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&language=ENG&from=1&to=1`,
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
      total: null,
      error,
      isValid: false,
      responseHeader: {}
    }
  }

}

module.exports = {
  getTotalHotelsByRequest
}