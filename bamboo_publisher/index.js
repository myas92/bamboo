const rabbitWrapper = require('./rabbit-wrapper')
const Initializer = require('./config/initialize')
const { generateRange } = require('./utils/generate-range');
const { getHotelsContentByRequest } = require("./utils/hotels-content")
const { publishHotelInfo } = require("./events/publisher");
const { getTotalHotelsByRequest } = require('./utils/total-hotels');
const { LIMIT_RANGE_REQUEST } = require('./config/static-variables');

async function runner(processedLastRangeIndex=-1) {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
        const { mongoDB } = await Initializer.run()

        const { total } = await getTotalHotelsByRequest()
        const range = generateRange(total, LIMIT_RANGE_REQUEST)
        //TODO: read value from database the processedLastRangeIndex variable
        for (let [index, currentRange] of range.entries()) {
            if (index > processedLastRangeIndex) {
                console.log(currentRange)
                const { data, error } = await getHotelsContentByRequest(currentRange)
                if (error) {
                    if (error?.response?.status == 403) {
                        // TODO: do something
                        runner(processedLastRangeIndex)
                        throw new Error('API KEY is incorrect')
                    }
                    // TODO: use database
                    console.log('last range index is:', processedLastRangeIndex) 
                    throw new Error(error)
                }
                publishHotelInfo(data)
                processedLastRangeIndex = index;
            }
        }

    } catch (error) {
        console.log(error.message)
    }
}
runner()