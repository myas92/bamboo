const Initializer = require('./config/initialize')
const rabbitWrapper = require('./rabbit-wrapper')
const { generateRange } = require('./utils/generate-range');
const { getHotelsContentByRequest } = require("./utils/hotels-content")
const { publishHotelInfo } = require("./events/publisher");
const { getTotalHotelsByRequest } = require('./utils/total-hotels');
const { LIMIT_RANGE_REQUEST } = require('./config/static-variables');

async function runner() {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
        const {total} = await getTotalHotelsByRequest()
        const range = generateRange(total, LIMIT_RANGE_REQUEST)
        
        for (const currentRange of range) {
            console.log(currentRange)
            const { data, error } = await getHotelsContentByRequest(currentRange)
            if (error) {
                if(error.response.status==403){
                    // TODO: do something
                }
                console.log(error)
            }
             publishHotelInfo(data)

        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
runner()