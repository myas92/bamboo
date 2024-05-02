require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('./generate-hash');
const { refresherApiKey } = require('./refresher-api-key');

const getHotelsContentByRequest = async ({ from, to }) => {
  try {
    const {token, secret} = await refresherApiKey()
    if(!token){
      return {data:null, error: 'API KEY is invalid', from, to}
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

    const { data } = await axios.request(config);
    return { data, from, to, error: null }
  } catch (error) {
    return {
      data: null, error, from, to
    }
  }

}

module.exports = {
  getHotelsContentByRequest
}