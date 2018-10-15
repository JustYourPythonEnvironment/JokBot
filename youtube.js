const stringSimilarity = require('string-similarity');
const cheerio = require('cheerio');

const { asyncRequest } = require('./utils/utils.js');

const baseUrl = 'https://www.youtube.com/results?search_query=';

const MATCH_SENSITIVITY = 0.2;
const INVALID_TITLE_WORDS = /\blyrics\b|\bmirrored\b|\bteaser\b|\btrailer\b|\bdance practice\b/;
const MV_SCOPING_WORDS = /\bmv\b|\bm\/v\b|\bmusic video\b/;

function _cleanSearchString(str) {
    return str.toLowerCase().replace(' by ', ' ').replace(' - ', '').replace(/\s\s+/g, ' ').trim();
};

function _enhanceSearchString(str) {
    if (MV_SCOPING_WORDS.test(str)) return str;
    return `${str} mv`
};

function _buildYoutubeSearchUrl(str) {
    const encodedString = encodeURI(str).replace(/\&/g, '%26').replace(/\%20/g, '+');
    return `${baseUrl}${encodedString}`;
};

async function getYoutubeUrl(searchString) {
    const cleanedSearchString = _cleanSearchString(searchString);
    const enhancedSearchString = _enhanceSearchString(cleanedSearchString);
    const youtubeSearchUrl = _buildYoutubeSearchUrl(enhancedSearchString);
    const youtubeResultsPage = await asyncRequest(youtubeSearchUrl);
    const $ = cheerio.load(youtubeResultsPage);
    let match;

    $('h3.yt-lockup-title > a').each((index, el) => {
        let title = $(el).text();
        let url = `https://www.youtube.com${$(el).attr('href')}`;

        if ((stringSimilarity.compareTwoStrings(title, searchString)) >= MATCH_SENSITIVITY && !(INVALID_TITLE_WORDS.test(title.toLowerCase()))) {
            match = { title, url };
            return false;
        }
    });

    return match;
};

module.exports = {
    getYoutubeUrl,
};


