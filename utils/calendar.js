const cheerio = require('cheerio');
const { asyncRequest, getDateObj } = require('./utils.js');

const baseUrl = 'https://k2nblog.com';

async function _getCalendarData(dateObj, dayOffset) {
    const { day, month, year } = dateObj;
    const allNewReleases = {}
    const calendarDate = `${year}/${month}/${day - dayOffset}`;
    const dataUrl = `${baseUrl}/${calendarDate}/`;
    const releaseTypeRegex = /\[[^\[\]]*\]/;
    const fileTagRegex = /\([^\(]+$/;
    let currentPageNum = 1;

    try {
        let currentPage;
        while(currentPage = await asyncRequest(`${dataUrl}page/${currentPageNum++}`)) {
            const $ = cheerio.load(currentPage);
            $('div.td-ss-main-content h3.entry-title.td-module-title > a').each( (index, el) => {
                let title = $(el).text();
                let releaseType = releaseTypeRegex.exec(title)[0];
                title = title.replace(releaseTypeRegex, '')
                             .replace(fileTagRegex, '');

                releaseType = releaseType.slice(1, -1);
                if(!allNewReleases[releaseType]) {
                    allNewReleases[releaseType] = [];
                }

                allNewReleases[releaseType].push(title.trim());
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
    const dateObj = getDateObj();
    const releaseData = await _getCalendarData(dateObj, dayOffset);
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
