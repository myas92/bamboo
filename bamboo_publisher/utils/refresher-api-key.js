const { MAX_USAGE_API_KEY } = require("../config/static-variables");
const Initializer = require('../config/initialize')

async function refresherApiKey() {
    try {
        const mongoDB = Initializer.mon
        const { token, secret } = await mongoDB.collection("tokens").findOneAndUpdate(
            { usage: { $lt: MAX_USAGE_API_KEY } },
            { $inc: { usage: 1 } },
            { sort: { "_id": 1 } }
        )
        return { token, secret, error: null }
    } catch (error) {
        return { error: error, token: null, secret: null }
    }
}

module.exports = {
    refresherApiKey
}