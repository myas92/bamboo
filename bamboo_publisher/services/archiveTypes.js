const Initializer = require('../config/initialize');
const { LIMIT_RANGE_REQUEST } = require('../config/static-variables');
const typesContentInfo = require('../config/types.json');
const { generateRange } = require('../utils/generate-range');
const { getHotelsContentTypesByRequest } = require('../requests/hotels-content-types-request');

async function getTypesHotelsInfoService(from = 1, to = LIMIT_RANGE_REQUEST) {
    try {
        for (let typeContent of typesContentInfo) {
            console.log('started:', typeContent);
            const { total } = await sendRequest({ ...typeContent, from, to })
            if(total> to){
                let skip = typeContent.skip ? typeContent.skip : 1
                const range = generateRange(total, LIMIT_RANGE_REQUEST, skip )
                for (let currentRange of range) {
                    console.log(`Range for ${typeContent.type}: ${currentRange.from} - ${currentRange.to}`)
                    await sendRequest({ ...typeContent, ...currentRange })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}


async function sendRequest({ url, type, from, to }) {
    const { total, data, error, isValid } = await getHotelsContentTypesByRequest({ url, type, from, to })
    if (error) {
        if (error?.response?.status == 403) {
            console.log('Error:', type)
            throw new Error('API KEY is incorrect')
        }
        console.log('Error:', type)
        console.log('retry to gathering data...!')
        await sendRequest({ url, type, from, to })
        return;
    }
    if (isValid)
        await storingHotelsContentTypes(data[type], type)
    return { total }
}

async function runnerContentType() {
    try {
        await Initializer.run()
        await getTypesHotelsInfoService()
    } catch (error) {
        console.error(error.message)
    }
}

async function storingHotelsContentTypes(data, type) {
    try {
        const mongoDB = Initializer.mon
        const updateManyOperation = data.map(item => ({
            updateOne: {
                filter: { code: item.code },
                update: { $set: { ...item } },
                upsert: true
            }
        }));

        await mongoDB.collection(type).bulkWrite(updateManyOperation, { ordered: false })
    } catch (error) {
        console.log(`Error in stroring data of ${type}`)

    }
}


module.exports = {
    runnerContentType
}