class Listener {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    onMessage() {
        console.log("Not Implemented")
    }
    async listen() {
        await this.channel.consume(this.queue, async (data) => {
            const msg = Buffer.from(data.content)
            // console.log(`Received ${msg}`)
            const parsedData = this.parseMessage(data)
            this.onMessage(parsedData, data, this.channel)
        }, {
            noAck: false
        })
    }

    parseMessage(msg) {
        const data = msg.content;
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}


module.exports = Listener