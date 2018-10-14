const request = require('request');
const cheerio = require('cheerio');
const baseUrl = 'https://k2nblog.com/';

const dateObj = new Date();
const month = dateObj.getMonth() + 1;
const day = dateObj.getDate();
const year = dateObj.getFullYear();

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

async function _getCalendarData(dayOffset) {
    const allNewReleases = {}
    const calendarDate = `${year}/${month}/${day - dayOffset}`;
    const dataUrl = `${baseUrl}/${calendarDate}/`;
    const releaseTypeRegex = /\[([^)]+)\][ \t]+/;
    const fileTagRegex = /(.*)([\t +]\([^\]]*\))/;
    let currentPageNum = 1;

    try {
        let currentPage;
        while(currentPage = await _asyncRequest(`${dataUrl}page/${currentPageNum++}`)) {
            const $ = cheerio.load(currentPage);
            $('h2.entry-title.grid-title > a').each( (index, el) => {
                let title = $(el).text();
                const releaseType = releaseTypeRegex.exec(title)[1];
                title = title.replace(releaseTypeRegex, '')
                             .replace(fileTagRegex, '$1');

                if(!allNewReleases[releaseType]) {
                    allNewReleases[releaseType] = [];
                }

                allNewReleases[releaseType].push(title);
            });
        }
    } catch(err) {
        console.error(err);
    }

    return {
        'releases': allNewReleases,
        'date': calendarDate,
        'url': dataUrl,
    }
};

async function generateCalendarEmbed(dayOffset = 0) {
    const releaseData = await _getCalendarData(dayOffset);
    const embed = {
        'author': {
            'name': `${dayOffset > 0 ? 'Finalized' : 'New'} Releases for ${releaseData.date}`,
            'url': releaseData.url,
            'icon_url': 'https://yt3.ggpht.com/a-/AN66SAwl4t2Xp-dMiNe7tzRNX5WaVlbwst4emwd4ZA=s900-mo-c-c0xffffffff-rj-k-no',
        },
        'color': 0xD1002A,
        'fields': [],
    };

    Object.keys(releaseData.releases).forEach(releaseType => {
        embed.fields.push({
            'name': releaseType,
            'value': releaseData['releases'][releaseType].map(release => `${release}\n`).join(''),
        });
    });
    return embed;
};

module.exports = {
    generateCalendarEmbed,
};
