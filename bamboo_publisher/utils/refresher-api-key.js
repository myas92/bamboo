const { MAX_USAGE_API_KEY } = require("../config/static-variables");
const Initializer = require('../config/initialize')

async function refresherApiKey(maxUsageApiKey = MAX_USAGE_API_KEY) {
    try {
        if (process.env.API_KEY && process.env.API_SECRET_KEY) {
            return { token: process.env.API_KEY, secret: process.env.API_SECRET_KEY, error: null }
        }
        
        const mongoDB = Initializer.mon
        const { token, secret } = await mongoDB.collection("tokens").findOneAndUpdate(
            { usage: { $lt: maxUsageApiKey } },
            { $inc: { usage: 1 } },
            { sort: { "_id": 1 } }
        )
        return { token, secret, error: null }
    } catch (error) {
        return { error: error, token: null, secret: null }
    }
}

async function getTotalRemainderUsageApiKey() {
    try {
        if (process.env.API_KEY && process.env.API_SECRET_KEY) {
            return 1000000
        }
        const mongoDB = Initializer.mon
        const result = await mongoDB.collection("tokens").aggregate([
            {
                $addFields: {
                    initialUsage: "$usage",
                    modifiedUsage: { $subtract: ["$usage", 50] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalModifiedUsage: { $sum: "$modifiedUsage" },
                }
            }
        ]).toArray()
        return Math.abs(result[0].totalModifiedUsage)
    } catch (error) {
        return { error: error, token: null, secret: null }
    }
}




module.exports = {
    refresherApiKey,
    getTotalRemainderUsageApiKey
}