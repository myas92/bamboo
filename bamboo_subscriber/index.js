const rabbitWrapper = require('./rabbit-wrapper');
const Initializer = require('./config/initialize')
const { HotelListener } = require('./events/hotel-listener')



async function runner() {
  try {
    await rabbitWrapper.connect(process.env.RABBITMQ_HOST, process.env.RABBITMQ_PORT);
    const { mongoDB } = await Initializer.run()
    new HotelListener(rabbitWrapper.channel, rabbitWrapper.alertQueue).listen()
    console.log("Running server on port", process.env.PORT || 3000)
  } catch (err) {
    console.log(error)

  }
}

runner()