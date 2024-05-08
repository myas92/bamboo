const crypto = require('crypto');

function generateHash(apiKey, secret) {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    const data = apiKey + secret + currentTimestamp;

    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

module.exports={
    generateHash
}