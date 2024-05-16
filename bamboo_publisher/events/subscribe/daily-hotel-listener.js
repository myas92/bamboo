const Listener = require("./listener");
const Initializer = require('../../config/initialize');
const { generateDetailsHotelByCode } = require("../../services/generateHotelDetails");
const fs = require('fs');
class DailyHotelListener extends Listener {
    constructor(channel, queue) {
        super(channel, queue);
        this.index = 0;
    }
    async onMessage(data, msg, channel) {
        const mongoDB = Initializer.mon

            try {
                let currentItem;
                const { hotels } = data
                const updateManyOperation = hotels.map(hotel => ({
                    updateOne: {
                        filter: { code: hotel.code },
                        update: { $set: { ...hotel } },
                        upsert: true
                    }
                }));

                let result = await mongoDB.collection("hotels").bulkWrite(updateManyOperation, { ordered: false })
                console.log(`Inserted ${data.from} - ${data.to} | modified count: ${result?.modifiedCount} `)
                // upsert hotel details
                for (const [index, hotel] of hotels.entries()) {
                    try {
                        currentItem=hotel
                            let detailsHotel = await generateDetailsHotelByCode(hotel)
                            await mongoDB.collection("details").updateOne({
                                code: detailsHotel.code
                            }, {
                                $set: detailsHotel
                            }, { upsert: true });
                    } catch (error) {
                        console.log(error);
                    }
                }
                 channel.ack(msg)
            } catch (error) {
                console.log(error);
                 fs.appendFileSync('error.txt', `${code.toString()}\n`, 'utf8');
                 fs.appendFileSync('hotelsError.txt', `${currentItem.toString()}\n`, 'utf8');
            }
    }
}

module.exports = {
    DailyHotelListener
}