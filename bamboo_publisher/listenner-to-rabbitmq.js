require('dotenv').config();
const rabbitWrapper = require('./config/rabbit-wrapper');
const Initializer = require('./config/initialize')
const { HotelListener } = require('./events/subscribe/hotel-listener')



async function runner() {
  try {
    await Initializer.run()
    await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
    new HotelListener(rabbitWrapper.channel, rabbitWrapper.hotelQueue).listen()
    console.log("Running server on port", process.env.PORT || 3000)
  } catch (err) {
    console.log(err)

  }
}

runner()