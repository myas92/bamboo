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

            try {
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
                        console.log(index);
                        if(index > 52){
                            let detailsHotel = await generateDetailsHotelByCode(hotel)
                            await mongoDB.collection("details").updateOne({
                                code: detailsHotel.code
                            }, {
                                $set: detailsHotel
                            }, { upsert: true });
                        }

                    } catch (error) {
                        console.log(error);
                    }
                }
                // const result = await mongoDB.collection("hotels").insertMany(hotels);
                channel.ack(msg)
                // Commit the transaction if all operations succeed
                res.status(200).send('Bulk write operations committed successfully.');
            } catch (error) {
                // Abort the transaction if any operation fails
                await session.abortTransaction();
                res.status(500).send('Bulk write operations failed. Transaction aborted.');
            }












            const { hotels } = data
            const updateManyOperation = hotels.map(hotel => ({
                updateOne: {
                    filter: { code: hotel.code },
                    update: { $set: { ...hotel } },
                    upsert: true
                }
            }));

            let result = await mongoDB.collection("hotels").bulkWrite(updateManyOperation, { ordered: false })
            // const result = await mongoDB.collection("hotels").insertMany(hotels);
            console.log(`Inserted ${data.from} - ${data.to} | modified count: ${result?.modifiedCount} `)
            channel.ack(msg)
        } catch (error) {
            console.log("hotelListener", error)

        }

    }
}

module.exports = {
    DailyHotelListener
}