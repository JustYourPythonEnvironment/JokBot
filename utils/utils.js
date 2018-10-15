const request = require('request');
const errorPhrases = require('../assets/errorPhrases.json'); 

asyncRequest = (url) => {
    return new Promise( (resolve, reject) => {
        request(url, (error, res, body) => {
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


module.exports = {
    asyncRequest,
    logAndMsg,
    getRandomIndex,
    errAndMsg,
};

