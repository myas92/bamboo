const objects = [
    { api_key: 'asdadsasd1', usage: 50 },
    { api_key: 'asdadsasd2', usage: 60 },
    { api_key: 'asdadsasd3', usage: 50 },
    { api_key: 'asdadsasd4', usage: 0 }
];

const result = objects.find((obj, index) => obj.usage < 50 && index === objects.findIndex(o => o.usage < 50));

console.log(result, objects.indexOf(result));