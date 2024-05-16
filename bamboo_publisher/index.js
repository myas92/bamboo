const { runnerArhcive } = require("./services/archiveHotelsInfo");
const { runnerContentType } = require("./services/archiveTypes");
const { runnerDaily } = require("./services/dailyHotelsInfo");
const { generateHotelDetails } = require("./services/generateHotelDetails");
//generateHotelDetails()
// runnerContentType('2024-05-03')
// runnerArhcive()
runnerDaily('2024-05-16 09:10:10')