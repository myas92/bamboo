function generateRange(limit, step, skip=0) {
    const result = [];
    let level=0;
    for (let i = 1; i <= limit; i += step) {
        if(level>=skip){
            let from = i;
            let to = i + step - 1;
            if (to > limit) {
                to = limit;
            }
            result.push({ from, to });
        }
        level= level+1;
    }
    return result;
}


module.exports={
    generateRange
}