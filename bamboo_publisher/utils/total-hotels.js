require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('./generate-hash');
const { refresherApiKey } = require('./refresher-api-key');

const getTotalHotelsByRequest = async () => {
  try {
    const ApiKey = refresherApiKey()
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&language=ENG&from=1&to=1`,
      headers: {
        'Api-key': ApiKey,
        'X-Signature': generateHash(ApiKey, process.env.API_SECRET),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      timeout: process.env.API_TEIMEOUT
    };

    const { data } = await axios.request(config);
    return { total: data.total, error: null }
  } catch (error) {
    return {
      total: null,
      error
    }
  }

}

module.exports={
  getTotalHotelsByRequest
}