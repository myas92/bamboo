const MAX_USAGE=50;
let currentUsage=0;
function refresherApiKey(){
    if(currentUsage > MAX_USAGE ){
        // TODO: generate new API_KEY
        currentUsage=0;
    }
    currentUsage = currentUsage+1;
    return 'cdf305068093bca081d15bdd1187e257'
}

module.exports = {
    refresherApiKey
}