require('dotenv').config()
const axios = require('axios');
const { generateHash } = require('../utils/generate-hash');
const { refresherApiKey } = require('../utils/refresher-api-key');
const { MAX_USAGE_API_KEY_TYPES } = require('../config/static-variables');


const getHotelsContentTypesByRequest = async ({ url, type, from, to, lastUpdateTime }) => {
  try {
    const { token, secret } = await refresherApiKey(MAX_USAGE_API_KEY_TYPES)
    if (!token) {
      return { data: null, error: 'API KEY is invalid', }
    }
    let params ={
      from: from,
      to: to
    }
    if(lastUpdateTime){
      params['lastUpdateTime']=lastUpdateTime
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.API_URL_TYPES_HOTEL}/${url}`,
      headers: {
        'Api-key': token,
        'X-Signature': generateHash(token, secret),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      params: params,
      timeout: process.env.API_TEIMEOUT
    };

    const response = await axios.request(config);
    // if (!validateResponseTypes(type)) {
    //   throw new Error('Response Request is invalid')
    // }
    if (response.data[type]) {
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
    }

    return {
      data: null, total: 0, error, isValid: false
    }
  } catch (error) {
    console.error(error.message)
    return {
      data: null, total: 0, error, isValid: false
    }
  }

}

module.exports = {
  getHotelsContentTypesByRequest
}