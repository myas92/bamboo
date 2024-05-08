const { MongoClient } = require('mongodb');
require('dotenv').config();

class Initializer {
    constructor() {
        this.mongo
    }
    run = async () => {
        const mongoDB = await this.mongoDB();
        this.mongo = mongoDB
        if(process.env.CREATE_INDEXES == 'true'){
            await this.createIndexes();
        }
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
        console.log("Connected to mongoDB")
        return db;
    }
    createIndexes = async () => {
        try {
            const hotelsCollection = await this.mongo.collection('hotels');
            const roomsCollection = await this.mongo.collection('rooms');
            const rateCommentsCollection = await this.mongo.collection('rateComments');
            const detailsCollection = await this.mongo.collection('details');
            await hotelsCollection.createIndex({ code: 1 }, { unique: true })
            await roomsCollection.createIndex({ code: 1 }, { unique: true })
            await rateCommentsCollection.createIndex({ code: 1 }, { unique: true })
            await detailsCollection.createIndex({ code: 1 }, { unique: true })
        } catch (error) {
            console.error('create indexes error: ', error)
        }
    }
}
module.exports = new Initializer()