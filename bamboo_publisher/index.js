const rabbitWrapper = require('./rabbit-wrapper')
const Initializer = require('./config/initialize')
const { generateRange } = require('./utils/generate-range');
const { getHotelsContentByRequest } = require("./utils/hotels-content")
const { publishHotelInfo } = require("./events/publisher");
const { getTotalHotelsByRequest } = require('./utils/total-hotels');
const { LIMIT_RANGE_REQUEST } = require('./config/static-variables');
const { getTotalRemainderUsageApiKey, refresherApiKey } = require('./utils/refresher-api-key');

async function checkStatusService() {
    let totalRemainderUsage = await getTotalRemainderUsageApiKey()
    const { total, isValid, responseHeader, error } = await getHotelsContentByRequest({from: 1, to:1})
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

async function getHotelsInfoService(total) {
    const range = generateRange(total, LIMIT_RANGE_REQUEST)
    for (let currentRange of range) {
        console.log('started:', currentRange)
        const { data, error, isValid } = await getHotelsContentByRequest(currentRange)
        if (error) {
            if (error?.response?.status == 403) {
                console.error(`Error: range is ${currentRange}`)
                throw new Error('API KEY is incorrect')
            }
            console.log('Error: range is', currentRange)
            throw new Error(error)
        }
        if (isValid)
            publishHotelInfo(data)
    }
}

async function runner() {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
        await Initializer.run()

        let { crawlingServiceStatus, total, isValid } = await checkStatusService()
        if (crawlingServiceStatus) {
            if (total > 0 && isValid) {
                await getHotelsInfoService(total)
            }
        }

    } catch (error) {
        console.log(error.message)
    }
}




runner()