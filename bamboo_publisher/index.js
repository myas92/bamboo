const Initializer = require('./config/initialize')
const rabbitWrapper = require('./rabbit-wrapper')
const { generateRange } = require('./utils/generate-range');
const { getHotelsContentByRequest } = require("./utils/hotels-content")
const { publishHotelInfo } = require("./events/publisher");

async function runner() {
    try {
        await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
        const range = generateRange(1000, 100)
        
        for (const currentRange of range) {
            console.log(currentRange)
            const { data, error } = await getHotelsContentByRequest(currentRange)
            if (error) {
                // TODO: do something
                console.log(error)
            }
            await publishHotelInfo(data)

        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
runner()