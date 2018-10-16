const stringSimilarity = require('string-similarity');
const korStringSimilarity = require('kor-string-similarity');
const cheerio = require('cheerio');

const { asyncRequest } = require('./utils.js');

const baseUrl = 'https://www.youtube.com/results?search_query=';

const MATCH_SENSITIVITY = 0.2;
const INVALID_TITLE_WORDS = /\blyrics\b|\bmirrored\b|\bteaser\b|\btrailer\b|\bdance practice\b|\bdance video\b|\bpractice video\b|\bchoreography\b/g;
const MV_SCOPING_WORDS = /\bmv\b|\bm\/v\b|\bmusic video\b/g;
const ASCII = /^[ -~]+$/;

function _cleanSearchString(str) {
    return str.toLowerCase()
        .replace(/\b\sby\s\b|\b\s\-\s\b/g, ' ')
        .replace(INVALID_TITLE_WORDS, ' ')
        .replace(/\s\s+/g, ' ')
        .trim();
};

function _optimizeStringForDiff(str) {
    return str.replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, ' ')
        .replace(/\s\s+/g, ' ')
        .toLowerCase()
        .replace(/\bm v\b/gm, 'mv')
        .trim();
};

function _enhanceSearchString(str) {
    if (MV_SCOPING_WORDS.test(str)) return str;
    return `${str} mv`;
};

function _buildYoutubeSearchUrl(str) {
    const encodedString = encodeURIComponent(str);
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
        const title = $(el).text();
        const url = `https://www.youtube.com${$(el).attr('href')}`;

        const diffOptimizedTitle = _optimizeStringForDiff(title);
        const diffOptimizedEnhancedSearch = _optimizeStringForDiff(enhancedSearchString);
        const simScore = !ASCII.test(diffOptimizedEnhancedSearch)
            ? korStringSimilarity.compareTwoStrings(diffOptimizedTitle, diffOptimizedEnhancedSearch)
            : stringSimilarity.compareTwoStrings(diffOptimizedTitle, diffOptimizedEnhancedSearch);
        console.log({diffOptimizedTitle, diffOptimizedEnhancedSearch, simScore});

        if ((simScore >= MATCH_SENSITIVITY) && !(INVALID_TITLE_WORDS.test(title.toLowerCase()))) {
            match = { title, url };
            return false;
        }
    });

    return match;
};

module.exports = {
    getYoutubeUrl,
};

