const cheerio = require('cheerio');

const { asyncRequest } = require('./utils.js');

const baseUrl = 'https://colorcodedlyrics.com/?s=';

function _cleanSearchString(str) {
    return str.toLowerCase()
        .replace(/\b\sby\s\b|\b\s\-\s\b/g, ' ')
        .replace(/\s\s+/g, ' ')
        .trim();
};

function _buildCCLyricsSearchUrl(str) {
    const encodedString = encodeURIComponent(str);
    return `${baseUrl}${encodedString}`;
};

async function getCCLyricsUrl(searchString) {
    const cleanedSearchString = _cleanSearchString(searchString);
    const ccLyricsSearchUrl = _buildCCLyricsSearchUrl(cleanedSearchString);
    const ccLyricsResultsPage = await asyncRequest(ccLyricsSearchUrl);
    const $ = cheerio.load(ccLyricsResultsPage);
    let match;

    $('#main > article.post .entry-title > a').each((index, el) => {
        const url = $(el).attr('href');
        if (url !== undefined) {
            match = url;
            return false;
        }
    });
    return match;
};

module.exports = {
    getCCLyricsUrl,
};

