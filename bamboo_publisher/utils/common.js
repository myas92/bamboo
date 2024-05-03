function chunkArray(arr, chunkSize) {
    const chunkedArrays = [];
    let to;
    for (let i = 0; i < arr.hotels.length; i += chunkSize) {
        let hotels = arr.hotels.slice(i, i + chunkSize)
        chunkedArrays.push({
            auditData: arr.auditData,
            from: i+1,
            hotels: hotels,
            to: i + hotels.length
        });
    }
    return chunkedArrays;
}


module.exports = {
    chunkArray
}