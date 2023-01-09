
const fs = require('fs');

const readData = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
}

const writeData = (payload) => {
    let data = fs.readFileSync('data.json','utf8');
    data = JSON.parse(data);
    data.push(payload);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return payload;
}

module.exports = {
    readData: readData,
    writeData: writeData
}