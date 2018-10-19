const request = require('request');
const errorPhrases = require('../assets/errorPhrases.json'); 

asyncRequest = (url, spoofHeaders = false) => {

    if (spoofHeaders) {
        return new Promise((resolve, reject) => {
            request(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            }, (error, res, body) => {
                if (!error && (res.statusCode == 200 || res.statusCode == 301)) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

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

