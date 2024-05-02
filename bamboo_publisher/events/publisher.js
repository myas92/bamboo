const rabbitWrapper = require('../rabbit-wrapper')

async function publisher({ channel, queue, data }) {
  channel.sendToQueue(
    queue,
    Buffer.from(
      JSON.stringify({
        ...data,
      }),
    ),
    { persistent: true }
  )
  return false
}
async function publishHotelInfo(data) {
  try {
    publisher({
      data: data,
      channel: rabbitWrapper.channel,
      queue: rabbitWrapper.hotelQueue
    })
  } catch (error) {
    console.log("----------------publish Hotel Info error:", error)
  }

}


module.exports = {
  publisher,
  publishHotelInfo,
}