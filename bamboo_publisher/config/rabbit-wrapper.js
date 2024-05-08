const amqp = require('amqplib')
const { config } = require('dotenv')
config()
const QUEUE = {
    hotel: 'hotel_queue',
    dailyHotel: 'daily_hotel_queue'
}
class RabbitWrapper {
    _client
    _channel
    _queue
    get client() {
        if (!this._client) {
            throw new Error('cannot access rabbitMQ client before connecting')
        }
        return this._client;
    }
    get channel() {
        if (!this._channel) {
            throw new Error('cannot access rabbitMQ channel before connecting')
        }
        return this._channel;
    }
    get hotelQueue() {
        return QUEUE.hotel;
    }
    get dailyHotelQueue() {
        return QUEUE.dailyHotel;
    }

    async insertQueues() {
        for (const key of Object.keys(QUEUE)) {
            await this._channel.assertQueue(QUEUE[key],{durable: true});
        }
    }

    async connect(url) {
        try {
            const amqpServer = `${url}` || 'amqp://localhost:5673';
            this._client = await amqp.connect(amqpServer);
            this._channel = await this._client.createChannel();
            await this.insertQueues()
            this._channel.prefetch(1); // تعدا پیام هایی که باید بگیرد
            console.log('connected to rabbitmq')
        } catch (error) {
            throw new Error(error)
        }

    }
}


module.exports = new RabbitWrapper()