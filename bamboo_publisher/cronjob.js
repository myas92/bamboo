const { CronJob } = require('cron');
const { runnerDaily } = require('./services/dailyHotelsInfo');
const moment = require('moment-timezone');
const { runnerContentType } = require('./services/archiveTypes');
// Every days at 10:00:00 AM
const cronConfigDaily = {
    pattern: '0 0 10 * * *',
    subtract: 1,
    type: 'days',
    format: 'YYYY-MM-DDTHH:mm:ss.SSS'
}

// Every days at 10:00:00 AM
const cronConfigTypes = {
    pattern: '0 0 10 * * *',
    subtract: 1,
    type: 'days',
    format: 'YYYY-MM-DDTHH:mm:ss.SSS'
}

// Every minutes
// const cronConfigDaily = {
//     pattern: '0 */1 * * * *',
//     subtract: 1,
//     type: 'minutes',
//     format: 'YYYY-MM-DDTHH:mm:ss.SSS'
// }

// Every TEST
// const cronConfigDaily = {
//     pattern: '0 40 13 * * *',
//     subtract: 6,
//     type: 'hours',
//     format: 'YYYY-MM-DDTHH:mm:ss.SSS'
// }

new CronJob(
    cronConfigDaily.pattern,
    async function () {
        const now = moment();
        const newTime = now.subtract(cronConfigDaily.subtract, cronConfigDaily.type);
        let lastUpdateTime = newTime.format(cronConfigDaily.format)
        console.log(`started daily hotel content at`, lastUpdateTime);
        await runnerDaily(lastUpdateTime)
    },
    null,
    true,
);

new CronJob(
    cronConfigTypes.pattern,
    async function () {
        const now = moment();
        const newTime = now.subtract(cronConfigTypes.subtract, cronConfigTypes.type);
        let lastUpdateTime = newTime.format(cronConfigTypes.format)
        console.log(`started daily hotel content at`, lastUpdateTime);
        await runnerContentType(lastUpdateTime)
    },
    null,
    true,
);
