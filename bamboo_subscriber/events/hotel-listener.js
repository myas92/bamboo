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


            const operations = dataToInsert.map(item => ({
                insertOne: { document: item }
            }));
            
            db.collection.bulkWrite(operations, { ordered: false })
                .then(result => {
                    console.log("Data inserted successfully:", result);
                })
                .catch(error => {
                    console.error("Error inserting data:", error);
                });




            await mongoDB.collection("hotels").updateOne({
                code : item.code,
            },{
                $set: {
                    ...item
                }
            }, {
                upsert: true
            });


            const result = await mongoDB.collection("hotels").insertMany(hotels);
            channel.ack(msg)
        } catch (error) {
            console.log("hotelListener", error)

        }

    }
}

module.exports = {
    HotelListener
}