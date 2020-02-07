const request = require('request');
const cheerio = require('cheerio');
const { getYoutubeUrl } = require('./youtube');
const dataURL = 'http://www.instiz.net/iframe_ichart_score.htm';

function getChartDataSource() {
    return dataURL;
}

function getChartData() {
    return new Promise( (resolve, reject) => {
        request(dataURL, async (err, res, html) => {
            const rankings = [];

            if (!err && res.statusCode == 200) {
                const $ = cheerio.load(html);
                const rankRegex = /([^\/]+)(?=\.\w+$)/gm;

                const firstPlaceRank = rankRegex.exec($('div#score_1st > div.ichart_score_rank > img').attr('src'))[1];
                const firstPlaceSong = $('div#score_1st > div.ichart_score_song > div.ichart_score_song1').text();
                const firstPlaceArtist = $('div#score_1st > div.ichart_score_artist > div.ichart_score_artist1').text();
                const youtubeUrl = await getYoutubeUrl(`${firstPlaceSong} ${firstPlaceArtist}`); 
                const firstPlaceUrl = youtubeUrl ? youtubeUrl.url : 'N/A'

                rankings.push({
                    rank: firstPlaceRank,
                    song: firstPlaceSong,
                    artist: firstPlaceArtist,
                    link: firstPlaceUrl
                });

                for (const [index, el] of Object.entries($('div.spage_score_item'))) {
                    if (index > 13) break;

                    const currentRank = $('> div.ichart_score2_rank > img', el).attr('src').match(rankRegex)[0];
                    const currentSong = $('> div.ichart_score2_song > div.ichart_score2_song1', el).text();
                    const currentArtist = $('> div.ichart_score2_artist > div.ichart_score2_artist1', el).text();
                    const youtubeUrl = await getYoutubeUrl(`${currentSong} ${currentArtist}`); 
                    const currentUrl = youtubeUrl ? youtubeUrl.url : 'N/A'

                    console.log(youtubeUrl)

                    rankings.push({
                        rank: currentRank,
                        song: currentSong,
                        artist: currentArtist,
                        link: currentUrl
                    });
                }
                    
                // $('div.spage_score_item').each(async (index, el) => {
                //     if (index > 13) return false;

                //     const currentRank = $('> div.ichart_score2_rank > img', el).attr('src').match(rankRegex)[0];
                //     const currentSong = $('> div.ichart_score2_song > div.ichart_score2_song1', el).text();
                //     const currentArtist = $('> div.ichart_score2_artist > div.ichart_score2_artist1', el).text();
                //     const youtubeUrl = await getYoutubeUrl(`${currentSong} ${currentArtist}`); 
                //     const currentUrl = youtubeUrl ? youtubeUrl.url : 'N/A'

                //     rankings.push({
                //         rank: currentRank,
                //         song: currentSong,
                //         artist: currentArtist,
                //         link: currentUrl
                //     });
                // });

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
