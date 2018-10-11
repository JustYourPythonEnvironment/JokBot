const request = require('request');
const cheerio = require('cheerio');
const baseUrl = 'https://k2nblog.com/';

const dateObj = new Date();
const month = dateObj.getMonth() + 1; 
const day = dateObj.getDate() - 1;
const year = dateObj.getFullYear();

function _getCurrentUrl() {
    return `${baseUrl}/${year}/${month}/${day}/`;
}

function _asyncRequest(url) {
    return new Promise( (resolve, reject) => {
        request(url, (error, res, body) => {
            if (!error && (res.statusCode == 200 || res.statusCode == 301)) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

function getCalendarDataSource() {
    return _getCurrentUrl();
};

async function getCurrentData() {
    const allNewReleases = [];
    let currentPageNum = 1;

    while(1) {
        const currentPage = await _asyncRequest(`${_getCurrentUrl()}page/${currentPageNum++}`).catch(err => console.error(err));
        if(currentPage == null) break;
        const $ = cheerio.load(currentPage);
        $('h2.entry-title.grid-title > a').each( (index, el) => {
            allNewReleases.push($(el).text().replace(/[ \t]+\([^\][]*\)$/, ''));
        });
    }

    return allNewReleases;
};

getCurrentData().then(data => {
    console.log(data);
})

module.exports = {
    getCalendarDataSource,
    getCurrentData,
};
