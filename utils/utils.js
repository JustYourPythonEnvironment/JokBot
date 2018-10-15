const request = require('request');

function asyncRequest(url) {
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

module.exports = {
    asyncRequest,
}
