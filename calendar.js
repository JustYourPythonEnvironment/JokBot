const request = require('request');
const cheerio = require('cheerio');
const baseUrl = 'https://k2nblog.com/';

const dateObj = new Date();
const month = dateObj.getMonth() + 1; 
const day = dateObj.getDate(); 
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

async function getCalendarData() {
    const allNewReleases = {}
    const releaseTypeRegex = /\[([^)]+)\][ \t]+/;
    const fileTagRegex = /[ \t]+\([^\][]*\)$/;
    let currentPageNum = 1;

    while(1) {
        const currentPage = await _asyncRequest(`${_getCurrentUrl()}page/${currentPageNum++}`).catch(err => console.error(err));
        if(currentPage == null) break;
        const $ = cheerio.load(currentPage);
        $('h2.entry-title.grid-title > a').each( (index, el) => {
            let title = $(el).text();
            const releaseType = releaseTypeRegex.exec(title)[1];
            title = title.replace(releaseTypeRegex, '')
                         .replace(fileTagRegex, '');

            if(!allNewReleases[releaseType]) {
                allNewReleases[releaseType] = [];
            } 

            allNewReleases[releaseType].push(title);
        });
    }

    return allNewReleases;
};

module.exports = {
    getCalendarDataSource,
    getCalendarData,
};
