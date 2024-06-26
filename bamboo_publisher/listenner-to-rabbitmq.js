require('dotenv').config();
const rabbitWrapper = require('./config/rabbit-wrapper');
const Initializer = require('./config/initialize')
const { HotelListener } = require('./events/subscribe/hotel-listener');
const { DailyHotelListener } = require('./events/subscribe/daily-hotel-listener');



async function runner() {
  try {
    await Initializer.run()
    await rabbitWrapper.connect(process.env.RABBITMQ_URL);
    new HotelListener(rabbitWrapper.channel, rabbitWrapper.hotelQueue).listen()
    new DailyHotelListener(rabbitWrapper.channel, rabbitWrapper.dailyHotelQueue).listen()
    console.log("Running server on port", process.env.PORT || 3000)
  } catch (err) {
    console.log(err)

  }
}

runner()

module.exports = { runner };