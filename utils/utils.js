const request = require('request');
const errorPhrases = require('../assets/errorPhrases.json'); 

asyncRequest = (url, args = {}) => {
    return new Promise( (resolve, reject) => {
        request(url, args, (error, res, body) => {
            if (!error && (res.statusCode == 200 || res.statusCode == 301)) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};


logAndMsg = (channel, msg) => {
    console.log(msg);
    channel.send(msg);
};

getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

errAndMsg = (channel, err) => {
    console.error(err);
    channel.send(`${errorPhrases[getRandomIndex(errorPhrases)]} ${err}`);
};

isEmptyObj = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

getDateObj = () => {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    return { day, month, year };
}

module.exports = {
    asyncRequest,
    logAndMsg,
    getRandomIndex,
    errAndMsg,
    isEmptyObj,
    getDateObj,
};

