const { LIMIT_RANGE_REQUEST } = require("../config/static-variables")

function validateResponseStatusCode(response) {

    if (response.status == 200) {
        return true
    }
    console.log('invalid status code')
    return false
}

function validateHotelsData(data, chunkSize = LIMIT_RANGE_REQUEST) {
    if (data.hotels.length == chunkSize) {
        return true
    }
    else if ((data.total % chunkSize) == data.hotels.length) {
        return true
    }
    else if ((data.to == data.from) && data.from == data.hotels.length) {
        return true
    }
    console.log('invalid hotel length')
    return false
}

function validateHotelsDataItem(data) {
    let result = data.every(obj => obj.hasOwnProperty('code'))
    return result

}

function validateResponse(response) {
    try {
        if (validateResponseStatusCode(response) &&
            validateHotelsData(response.data) &&
            validateHotelsDataItem(response?.data?.hotels)
        ) {
            return true
        }
        return false
    } catch (error) {
        console.log(error);
        return false
    }

}



module.exports = {
    validateResponseStatusCode,
    validateHotelsData,
    validateResponse
}