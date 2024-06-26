const fs = require('fs');
const Initializer = require('../config/initialize');

async function runner() {
    const mongoDB = Initializer.mon;
    let codes = []
    try {
        codes = await mongoDB.collection('hotels').find({}, { projection: { _id: 0, code: 1, } }).toArray()
    } catch (error) {
        console.log(error);
    }
    for (let { code } of codes) {
        if (code > 0) {
            try {
                const foundedHotel = await mongoDB.collection('hotels').findOne({ code });
                if (foundedHotel) {
                    console.log(code);
                    let detailsHotel = await generateDetailsHotelByCode(foundedHotel)
                    await mongoDB.collection("details").insertOne(detailsHotel);
                }
            } catch (error) {
                console.log(object);
                console.log('runner in generate details: ', error);
            }

        }
    }

}

async function generateDetailsHotelByCode(foundedHotel) {
    try {
        let joinedHotelBoards = await joinBoards(foundedHotel)
        let joinedHotelAccommodationType = await joinAccommodationType(joinedHotelBoards)
        let joinedHotelCategory = await joinCategory(joinedHotelAccommodationType)
        let joinedHotelCategoryGroup = await joinCategoryGroup(joinedHotelCategory)
        let joinedHotelChain = await joinChain(joinedHotelCategoryGroup)
        let joinedHotelCountry = await joinCountry(joinedHotelChain)
        let joinedHotelDestination = await joinDestination(joinedHotelCountry)
        let joinedHotelFacilities = await joinfacilities(joinedHotelDestination)
        let joinedHotelImages = await joinImages(joinedHotelFacilities)
        let joinedHotelRooms = await joinRooms(joinedHotelImages)
        let joinedHotelSegments = await joinSegments(joinedHotelRooms)
        let joinedHotelTerminals = await joinTerminals(joinedHotelSegments)
        delete joinedHotelTerminals._id
        return joinedHotelTerminals
        // let json = JSON.stringify(joinedHotelTerminals);
        // fs.appendFileSync('myjsonfile.txt', `${code.toString()}\n`, 'utf8');
    } catch (error) {
        console.log(error.message)
    }
}

async function joinBoards(hotel) {
    try {
        if (hotel.boardCodes) {
            const mongoDB = Initializer.mon;
            let boards = await mongoDB.collection('boards').find({}).toArray()

            let result = hotel.boardCodes.map(code => {
                let match = boards.find(item => item.code === code);
                if (match) {
                    return {
                        code: match.code,
                        description: {
                            content: match?.description?.content ? match?.description?.content : ''
                        }
                    };
                }
            });

            result = result.filter(item => item);
            delete hotel.boardCodes
            hotel['boards'] = result
        }

        return hotel
    } catch (error) {
        console.log('Error in joinBoards');
    }


}


async function joinAccommodationType(hotel) {
    try {
        if (hotel.accommodationTypeCode) {
            const mongoDB = Initializer.mon;
            let accommodation = await mongoDB.collection('accommodations').findOne({ code: hotel.accommodationTypeCode }, { projection: { _id: 0 } })
            delete hotel.accommodationTypeCode;
            delete accommodation?.typeMultiDescription?.languageCode
            hotel['accommodationType'] = accommodation
        }
        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinCategory(hotel) {
    try {
        if (hotel.categoryCode) {
            const mongoDB = Initializer.mon;
            let result = await mongoDB.collection('categories').findOne({ code: hotel.categoryCode }, { projection: { _id: 0 } })
            delete hotel.categoryCode;
            delete result?.description?.languageCode
            hotel['category'] = {
                code: result.code,
                description: result.description ? result.description : ''
            }
        }
        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinCategoryGroup(hotel) {
    try {
        if (hotel.categoryGroupCode) {
            const mongoDB = Initializer.mon;
            let result = await mongoDB.collection('groupCategories').findOne({ code: hotel.categoryGroupCode }, { projection: { _id: 0 } })
            delete hotel.categoryGroupCode;
            delete result?.description?.languageCode
            hotel['categoryGroup'] = {
                code: result.code,
                description: result.description ? result.description : ''
            }
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinChain(hotel) {
    try {
        if (hotel.chainCode) {
            const mongoDB = Initializer.mon;
            let result = await mongoDB.collection('chains').findOne({ code: hotel.chainCode }, { projection: { _id: 0 } })
            delete hotel.chainCode;
            delete result?.description?.languageCode
            hotel['chain'] = {
                code: result.code,
                description: result.description ? result.description : ''
            }
        }
        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinCountry(hotel) {
    try {
        if (hotel.countryCode) {
            const mongoDB = Initializer.mon;
            let result = await mongoDB.collection('countries').findOne({ code: hotel.countryCode }, { projection: { _id: 0 } })
            delete hotel.countryCode;
            hotel['country'] = {
                code: result.code,
                description: result?.description ? result.description : '',
                isoCode: result.isoCode
            }
            if (hotel.stateCode) {
                let state = result.states.find(item => item.code == hotel.stateCode);
                hotel['state'] = {
                    code: hotel.stateCode,
                    name: state?.name ? state.name : ''
                }
                delete hotel.stateCode
            }
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinDestination(hotel) {
    try {
        if (hotel.destinationCode) {
            const mongoDB = Initializer.mon;
            let result = await mongoDB.collection('destinations').findOne({ code: hotel.destinationCode }, { projection: { _id: 0 } })
            delete hotel.destinationCode;
            hotel['destination'] = {
                code: result.code,
                countryCode: result.countryCode,
                name: result.name,
            }
            if (hotel.zoneCode) {
                let zone = result.zones.find(item => item.zoneCode == hotel.zoneCode);
                hotel['zone'] = {
                    zoneCode: zone.zoneCode,
                    name: zone.name,
                    description: {
                        content: zone?.description?.content ? zone?.description?.content : ''
                    }
                }
                delete hotel.zoneCode
            }
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}
async function joinfacilities(hotel) {
    try {
        if (hotel.facilities) {
            const mongoDB = Initializer.mon;
            let facilities = await mongoDB.collection('facilities').find({}).toArray()

            let result = hotel.facilities.map(facility => {
                let match = facilities.find(item => item.code === facility.facilityCode && item.facilityGroupCode === facility.facilityGroupCode);
                if (match) {
                    return {
                        description: {
                            content: match?.description?.content ? match?.description?.content : ''
                        },
                        ...facility
                    };
                }
            });
            result = result.filter(item => item);
            hotel['facilities'] = result
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}
async function joinImages(hotel) {
    try {
        if (hotel.images) {
            const mongoDB = Initializer.mon;
            let imageTypes = await mongoDB.collection('imageTypes').find({}).toArray()

            let result = hotel.images.map(image => {
                let match = imageTypes.find(item => item.code === image.imageTypeCode);
                let imageType = image.imageTypeCode
                delete image.imageTypeCode
                if (match) {
                    return {
                        type: {
                            code: imageType,
                            description: {
                                content: match?.description?.content ? match?.description?.content : ''
                            },
                        },
                        ...image
                    };
                }
            });
            result = result.filter(item => item);
            hotel['images'] = result
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}

async function joinRooms(hotel) {
    try {
        if (hotel.rooms) {
            const mongoDB = Initializer.mon;
            let facilities = await mongoDB.collection('facilities').find({}).toArray()
            let result = [];
            for (const room of hotel.rooms) {
                let foundedRoomInfo = await mongoDB.collection('rooms').findOne({ code: room.roomCode, characteristic: room.characteristicCode }, { projection: { _id: 0 } })
                if (foundedRoomInfo) {
                    let roomFacilities = room.roomFacilities
                    let roomStays = room.roomStays
                    let roomType = room.roomType
                    let characteristicCode = room.characteristicCode
                    delete room.roomFacilities
                    delete room.roomFacilities
                    delete room.roomStays
                    delete room.characteristicCode
                    delete room.roomType
                    let roomObject = {
                        characteristic: {
                            code: characteristicCode,
                            description: {
                                content: foundedRoomInfo?.characteristicDescription?.content ? foundedRoomInfo?.characteristicDescription?.content : ''
                            }

                        },
                        description: foundedRoomInfo?.description ? foundedRoomInfo?.description : '',
                        ...room,
                        type: {
                            code: foundedRoomInfo.type,
                            description: {
                                content: foundedRoomInfo?.typeDescription?.content ? foundedRoomInfo?.typeDescription?.content : ''
                            }
                        }
                    }
                    if (roomFacilities) {
                        roomObject['roomFacilities'] = updateRoomFacilities(roomFacilities, facilities)
                    }
                    if (roomStays) {
                        roomObject['roomStays'] = updateRoomStay(roomStays, facilities)
                    }
                    result.push(roomObject)
                }
                else {
                    console.error('room info not found: ', { code: room.roomCode, characteristic: room.characteristicCode });
                }

            }

            result = result.filter(item => item);
            hotel['rooms'] = result
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}



function updateRoomFacilities(roomFacilities, facilities) {
    try {
        if (roomFacilities) {
            let result = roomFacilities.map(facility => {
                let match = facilities.find(item => item.code === facility.facilityCode && item.facilityGroupCode === facility.facilityGroupCode);
                if (match) {
                    return {
                        description: {
                            content: match?.description?.content ? match?.description?.content : ''
                        },
                        ...facility
                    };
                }
            });
            return result
        }
        return []
    } catch (error) {
        console.log('Error in');
    }

}

function updateRoomStay(roomStays, facilities) {
    try {
        let result = roomStays.map(roomStay => {
            let roomStayFacilities = roomStay.roomStayFacilities
            delete roomStay.roomStayFacilities
            let roomObject = { ...roomStay }
            if (roomStayFacilities) {
                roomObject['roomStayFacilities'] = updateRoomFacilities(roomStayFacilities, facilities)
            }
            return roomObject
        });
        return result
    } catch (error) {
        console.log('Error in');
    }

}


async function joinSegments(hotel) {
    try {
        if (hotel.segmentCodes) {
            const mongoDB = Initializer.mon;
            let boards = await mongoDB.collection('segments').find({}).toArray()

            let result = hotel.segmentCodes.map(code => {
                let match = boards.find(item => item.code === code);
                if (match) {
                    return {
                        code: match.code,
                        description: {
                            content: match?.description?.content ? match?.description?.content : ''
                        }
                    };
                }
            });

            result = result.filter(item => item);
            delete hotel.segmentCodes
            hotel['segments'] = result
        }

        return hotel
    } catch (error) {
        console.log('Error in');
    }
}


async function joinTerminals(hotel) {
    try {
        if (hotel.terminals) {
            const mongoDB = Initializer.mon;
            let terminals = await mongoDB.collection('terminals').find({}).toArray()

            let result = hotel.terminals.map(terminal => {
                let match = terminals.find(item => item.code === terminal.terminalCode);
                if (match) {
                    return {
                        terminalCode: match.code,
                        distance: terminal.distance,
                        description: {
                            content: match?.description?.content ? match.description.content : ''
                        },
                        name: {
                            content: match?.name?.content ? match?.name?.content : ''
                        },
                        terminalType: match.type
                    };
                }
            });

            result = result.filter(item => item);
            delete hotel.segmentCodes
            hotel['terminals'] = result
        }
        return hotel
    } catch (error) {
        console.log('Error in');
    }
}



async function generateHotelDetails() {
    await Initializer.run()
    await runner()
}

// generateHotelDetails()
module.exports = {
    generateHotelDetails,
    generateDetailsHotelByCode
}