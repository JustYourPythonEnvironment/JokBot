const request = require('request');
const cheerio = require('cheerio');
const dataURL = 'http://www.instiz.net/iframe_ichart_score.htm';

function _createYoutubeLink(el) {
    const ytRegex = /'(.*?)'/gm;

    if (el) {
        return `https://www.youtube.com/watch?v=${ytRegex.exec(el)[1]}`;
    } 

    return '';
}

function getChartDataSource() {
    return dataURL;
}

function getChartData() {
    return new Promise( (resolve, reject) => {
        request(dataURL, (err, res, html) => {
            const rankings = [];

            if (!err && res.statusCode == 200) {
                const $ = cheerio.load(html);
                const rankRegex = /([^\/]+)(?=\.\w+$)/gm;

                const firstPlaceRank = rankRegex.exec($('div#score_1st > div.ichart_score_rank > img').attr('src'))[1];
                const firstPlaceSong = $('div#score_1st > div.ichart_score_song > div.ichart_score_song1').text();
                const firstPlaceArtist = $('div#score_1st > div.ichart_score_artist > div.ichart_score_artist1').text();
                const firstPlaceYoutubeLink = $('div#score_1st').next('div.spage_score_bottom').find('#yttop').attr('href');

                rankings.push({
                    rank: firstPlaceRank,
                    song: firstPlaceSong,
                    artist: firstPlaceArtist,
                    link: _createYoutubeLink(firstPlaceYoutubeLink)
                });

                $('div.spage_score_item').each((index, el) => {
                    if (index > 13) return false;

                    const currentRank = $('> div.ichart_score2_rank > img', el).attr('src').match(rankRegex)[0];
                    const currentSong = $('> div.ichart_score2_song > div.ichart_score2_song1', el).text();
                    const currentArtist = $('> div.ichart_score2_artist > div.ichart_score2_artist1', el).text();
                    const currentYoutubeLinkElement = $(el).next('div.ichart_submenu.minitext3').find('.ichart_mv').children('a').attr('href');

                    rankings.push({
                        rank: currentRank,
                        song: currentSong,
                        artist: currentArtist,
                        link: _createYoutubeLink(currentYoutubeLinkElement)
                    });
                });
            } else {
                console.log(`Error: ${err}`);
            }
            resolve(rankings);
        });
    });
}

module.exports = {
    getChartData,
    getChartDataSource
}
