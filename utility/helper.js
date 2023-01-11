const fs = require('fs');

const readData = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
}

const writeData = (payload) => {
    let data = fs.readFileSync('data.json', 'utf8');
    data = JSON.parse(data);
    data.push(payload);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return payload;
}

const getRandomID = (length) => {
    const id = [];
    if (!length) {
        length = 5;
    }
    for (let index = 0; index < length; index++) {
        const alphabet = Math.floor((Math.random() * 1000000) % 26);
        alphabet + 65
        id.push(String.fromCharCode(alphabet + 65));
    }
    return id.join('');
}

module.exports = {
    readData: readData,
    writeData: writeData,
    getRandomID: getRandomID
}