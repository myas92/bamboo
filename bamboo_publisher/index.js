const { runnerArhcive } = require("./services/archiveHotelsInfo");
const { runnerContentType } = require("./services/archiveTypes");
const { runnerDaily, getDailyData } = require("./services/dailyHotelsInfo");
const { generateHotelDetails } = require("./services/generateHotelDetails");

// first Step
// runnerArhcive()


// Second Step
// runnerContentType()


// Third Step
// generateHotelDetails()


//Content & Daily
getDailyData(90)