const Listener = require("./listener");
const Initializer = require('../config/initialize')
class HotelListener extends Listener {
    constructor(channel, queue) {
        super(channel, queue);
        this.index = 0;
    }
    async onMessage(data, msg, channel) {
        const mongoDB = Initializer.mon
        try {
            const { hotels } = data


            const updateManyOperation = hotels.map(hotel => ({
                updateOne: {
                    filter: { code: hotel.code }, 
                    update: { $set: {...hotel } }, 
                    upsert: true 
                }
            }));
            
            let updateManyResult = await mongoDB.collection("hotels2").bulkWrite(updateManyOperation, { ordered: false })
            // const result = await mongoDB.collection("hotels").insertMany(hotels);
            channel.ack(msg)
        } catch (error) {
            console.log("hotelListener", error)

        }

    }
}

module.exports = {
    HotelListener
}