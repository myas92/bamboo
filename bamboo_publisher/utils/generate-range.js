function generateRange(limit, step) {
    const result = [];
    
    for (let i = 1; i <= limit; i += step) {
        let from = i;
        let to = i + step - 1;
        if (to > limit) {
            to = limit;
        }
        
        result.push({ from, to });
    }
    
    return result;
}


module.exports={
    generateRange
}