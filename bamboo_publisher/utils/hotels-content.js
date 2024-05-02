require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('./generate-hash');

const getHotelsContentByRequest = async ({from, to}) => {
  try {
    const ApiKey = refresherApiKey()
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&language=ENG&from=${from}&to=${to}`,
      headers: {
        'Api-key': ApiKey,
        'X-Signature': generateHash(ApiKey, process.env.API_SECRET),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      timeout: process.env.API_TEIMEOUT
    };

    const { data } = await axios.request(config);
    return { data, from, to, error: null }
  } catch (error) {
    return {
      data: null,
      error,
      from,
      to
    }
  }

}

module.exports={
  getHotelsContentByRequest
}