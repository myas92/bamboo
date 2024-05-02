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
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const client = new MongoClient(url, option);
        await client.connect();
        const db = client.db();
        console.log("Connected to mongoDB")
        return db;
    }
}
module.exports = new Initializer()