const moment = require('moment-timezone');
const Initializer = require('../config/initialize');
const { LIMIT_RANGE_REQUEST } = require('../config/static-variables');
const typesContentInfo = require('../config/types.json');
const { generateRange } = require('../utils/generate-range');
const { getHotelsContentTypesByRequest } = require('../requests/hotels-content-types-request');

async function getTypesHotelsInfoService({from = 1, to = LIMIT_RANGE_REQUEST, lastUpdateTime}) {
    try {
        for (let typeContent of typesContentInfo) {
            if(typeContent.isScrap==true){
                console.log('started:', typeContent);
                const { total } = await sendRequest({ ...typeContent, from, to, lastUpdateTime })
                if(total> to){
                    let skip = typeContent.skip ? typeContent.skip : 1
                    const range = generateRange(total, LIMIT_RANGE_REQUEST, skip )
                    for (let currentRange of range) {
                        console.log(`Range for ${typeContent.type}: ${currentRange.from} - ${currentRange.to}`)
                        await sendRequest({ ...typeContent, ...currentRange, lastUpdateTime })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}


async function sendRequest({ url, type, from, to, lastUpdateTime }) {
    const { total, data, error, isValid } = await getHotelsContentTypesByRequest({ url, type, from, to, lastUpdateTime })
    if (error) {
        if (error == 'API KEY is incorrect' || error?.response?.status == 403) {
            console.log('Error:', type)
            throw new Error('API KEY is incorrect')
        }
        console.log('Error:', type)
        console.log('retry to gathering data...!')
        await sendRequest({ url, type, from, to, lastUpdateTime })
        return;
    }
    if (isValid)
        await storingHotelsContentTypes(data[type], type)
    return { total }
}

async function runnerContentType(lastUpdateTime) {
    try {
        await Initializer.run()
        lastUpdateTime = lastUpdateTime ? lastUpdateTime : moment().format('YYYY-MM-DD')
        await getTypesHotelsInfoService({from: 1, to: LIMIT_RANGE_REQUEST, lastUpdateTime })
    } catch (error) {
        console.error(error.message)
    }
}

async function storingHotelsContentTypes(data, type) {
    try {
        console.log(`Started storing of ${type}, number is ${data?.length}`);
        if(data?.length > 0){
            const mongoDB = Initializer.mon;
            let updateManyOperation;
            if(type=='facilities'){
                 updateManyOperation = data.map(item => ({
                    updateOne: {
                        filter: { code: item.code,  facilityGroupCode: item.facilityGroupCode, },
                        update: { $set: { ...item } },
                        upsert: true
                    }
                }));
            }else{
                 updateManyOperation = data.map(item => ({
                    updateOne: {
                        filter: { code: item.code },
                        update: { $set: { ...item } },
                        upsert: true
                    }
                }));
            }
            await mongoDB.collection(type).bulkWrite(updateManyOperation, { ordered: false })
        }

        console.log('Storing finished')
    } catch (error) {
        console.log(`Error in stroring data of ${type}`)

    }
}


module.exports = {
    runnerContentType
}