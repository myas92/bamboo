const { CHUNK_SIZE_TO_PUBLISH } = require('../config/static-variables')
const rabbitWrapper = require('../config/rabbit-wrapper')
const { chunkArray } = require('../utils/common')
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
    let chunkedHotels = chunkArray(data,CHUNK_SIZE_TO_PUBLISH)
    for (const hotels of chunkedHotels) {
      publisher({
        data: hotels,
        channel: rabbitWrapper.channel,
        queue: rabbitWrapper.hotelQueue
      })
    }

  } catch (error) {
    console.log("----------------publish Hotel Info error:", error)
  }

}

async function publishDailyHotelInfo(data) {
  try {
    let chunkedHotels = chunkArray(data,CHUNK_SIZE_TO_PUBLISH)
    for (const hotels of chunkedHotels) {
      publisher({
        data: hotels,
        channel: rabbitWrapper.channel,
        queue: rabbitWrapper.dailyHotelQueue
      })
    }

  } catch (error) {
    console.log("----------------publish daily Hotel Info error:", error)
  }

}



module.exports = {
  publisher,
  publishHotelInfo,
  publishDailyHotelInfo
}