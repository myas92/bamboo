const rabbitWrapper = require('../config/rabbit-wrapper')
const Initializer = require('../config/initialize')
const moment = require('moment-timezone');
const { generateRange } = require('../utils/generate-range');
const {  publishDailyHotelInfo } = require("../events/publish/publisher");
const { LIMIT_RANGE_REQUEST } = require('../config/static-variables');
const { getDailyHotelsContentByRequest } = require('../requests/hotels-daily-content-request');
const { getTotalRemainderUsageApiKey } = require('../utils/refresher-api-key');

async function checkStatusService(lastUpdateTime) {
    let totalRemainderUsage = await getTotalRemainderUsageApiKey()
    const { total, isValid, responseHeader, error } = await getDailyHotelsContentByRequest({ from: 1, to: 1, lastUpdateTime })
    if (error) {
        console.log(error)
        return {
            crawlingServiceStatus: false,
            total,
            isValid
        }
    }
    const numberTokenNeeded = Math.ceil(total / LIMIT_RANGE_REQUEST)
    if (totalRemainderUsage > numberTokenNeeded) {
        return {
            crawlingServiceStatus: true,
            total,
            isValid
        }
    } else {
        console.error(
            `There are not enough tokens to mine data.
             total tokens needed is: (${Math.ceil((numberTokenNeeded - totalRemainderUsage) / responseHeader.totalRequest)})`)
        return {
            crawlingServiceStatus: false,
            total, isValid
        }
    }
}

async function getHotelsInfoService({ total, skip = 0, lastUpdateTime }) {
    const range = generateRange(total, LIMIT_RANGE_REQUEST, skip)
    for (let [index, currentRange] of range.entries()) {
        console.log('started:', currentRange)
        const { data, error, isValid } = await getDailyHotelsContentByRequest({ ...currentRange, lastUpdateTime })
        if (error) {
            if (error?.response?.status == 403) {
                console.error(`Error: range is ${currentRange}`)
                throw new Error('API KEY is incorrect')
            }
            console.log('Error: range is', currentRange)
            console.log('retry to gathering data...!')
            await getHotelsInfoService({ total, skip: (skip + index), lastUpdateTime })
            return;
        }
        if (isValid)
            publishDailyHotelInfo(data)
    }
}

async function runnerDaily(lastUpdateTime) {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_URL);
        await Initializer.run()
        // generate current date
        lastUpdateTime = lastUpdateTime ? lastUpdateTime : moment().format('YYYY-MM-DD')
        let { crawlingServiceStatus, total, isValid } = await checkStatusService(lastUpdateTime)
        if (crawlingServiceStatus) {
            if (total > 0 && isValid) {
                await getHotelsInfoService({ total, lastUpdateTime })
            }
        }
        else{
            console.log('something went wrong...!');
        }
        console.log('Daily hotels information is completed successfully')
    } catch (error) {
        console.error(error.message)
    }
}


module.exports = {
    runnerDaily
}