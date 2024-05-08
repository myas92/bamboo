const rabbitWrapper = require('../config/rabbit-wrapper')
const Initializer = require('../config/initialize')
const { generateRange } = require('../utils/generate-range');
const { getHotelsContentByRequest } = require("../requests/hotels-content-request")
const { publishHotelInfo } = require("../events/publish/publisher");
const { LIMIT_RANGE_REQUEST } = require('../config/static-variables');
const { getTotalRemainderUsageApiKey } = require('../utils/refresher-api-key');

async function checkStatusService() {
    let totalRemainderUsage = await getTotalRemainderUsageApiKey()
    const { total, isValid, responseHeader, error } = await getHotelsContentByRequest({ from: 1, to: 1 })
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

async function getHotelsInfoService(total, skip = 0) {
    const range = generateRange(total, LIMIT_RANGE_REQUEST, skip)
    for (let [index, currentRange] of range.entries()) {
        console.log('started:', currentRange)
        const { data, error, isValid } = await getHotelsContentByRequest(currentRange)
        if (error) {
            if (error?.response?.status == 403) {
                console.error(`Error: range is ${currentRange}`)
                throw new Error('API KEY is incorrect')
            }
            console.log('Error: range is', currentRange)
            console.log('retry to gathering data...!')
            await getHotelsInfoService(total, (skip + index))
            return;
        }
        if (isValid)
            publishHotelInfo(data)
    }
}

async function runnerArhcive() {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
        await Initializer.run()
        let { crawlingServiceStatus, total, isValid } = await checkStatusService()
        if (crawlingServiceStatus) {
            if (total > 0 && isValid) {
                await getHotelsInfoService(total)
            }
        }
        console.log('Archive hotels information is completed successfully')
    } catch (error) {
        console.error(error.message)
    }
}


module.exports = {
    runnerArhcive
}