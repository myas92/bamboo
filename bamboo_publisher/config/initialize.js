const { MongoClient } = require('mongodb');
require('dotenv').config();

class Initializer {
    constructor() {
        this.mongo
     }
    run = async () => {
        const mongoDB = await this.mongoDB();
        this.mongo=mongoDB
        return { mongoDB }

    }
    get mon() {
        return this.mongo;
    }
    mongoDB = async () => {
        const url = process.env.MONGODB_URL;
        const option = {
        };
        const client = new MongoClient(url, option);
        await client.connect();
        const db = client.db();
        // const hotelsCollection = await db.collection('hotels3');
        // const roomsCollection = await db.collection('rooms');
        // const rateCommentsCollection = db.collection('rateComments');
        // await hotelsCollection.createIndex({ code: 1 }, { unique: true })
        // await roomsCollection.createIndex({ code: 1 }, { unique: true })
        // await rateCommentsCollection.createIndex({ code: 1 }, { unique: true })
        console.log("Connected to mongoDB")
        return db;
    }
}
module.exports = new Initializer()