const cheerio = require('cheerio');
const { asyncRequest, isEmptyObj } = require('./utils.js');

const dateObj = new Date();
const month = dateObj.getMonth() + 1;
const day = dateObj.getDate();

const birthdayListObj = {
    1: { url: 'https://www.wattpad.com/61299095-kpop-idols-birthday-list-january',
        shortName: 'Jan',
        },
    2: { url: 'https://www.wattpad.com/61299296-kpop-idols-birthday-list-february',
        shortName: 'Feb',
        },
    3: { url: 'https://www.wattpad.com/61299532-kpop-idols-birthday-list-march',
        shortName: 'Mar',
        },
    4: { url: 'https://www.wattpad.com/61299704-kpop-idols-birthday-list-april',
        shortName: 'Apr',
        },
    5: { url: 'https://www.wattpad.com/61299863-kpop-idols-birthday-list-may',
        shortName: 'May',
        },
    6: { url: 'https://www.wattpad.com/61300028-kpop-idols-birthday-list-june',
        shortName: 'Jun',
        },
    7: { url: 'https://www.wattpad.com/61300363-kpop-idols-birthday-list-july',
        shortName: 'Jul',
        },
    8: { url: 'https://www.wattpad.com/61302597-kpop-idols-birthday-list-august',
        shortName: 'Aug',
        },
    9: { url: 'https://www.wattpad.com/61302846-kpop-idols-birthday-list-september',
        shortName: 'Sept',
        },
    10: { url: 'https://www.wattpad.com/61303014-kpop-idols-birthday-list-october',
        shortName: 'Oct',
        },
    11: { url: 'https://www.wattpad.com/61303233-kpop-idols-birthday-list-november',
        shortName: 'Nov',
        },
    12: { url: 'https://www.wattpad.com/61303370-kpop-idols-birthday-list-december',
        shortName: 'Dec',
        }, 
};

async function _getBirthdayData() {
    const currentMonthBirthdays = {};
    const currentDay = `${birthdayListObj[month].shortName} ${day}`;

    try {
        const birthdayPage = await asyncRequest(`${birthdayListObj[month].url}`, true);
        const $ = cheerio.load(birthdayPage);

        let birthdate;
        $('pre > p').each((index, el) => {
            let insideText = $(el).text().trim();
            if (insideText.startsWith(birthdayListObj[month].shortName)) {
                birthdate = insideText;
                currentMonthBirthdays[birthdate] = [];
            } else {
                currentMonthBirthdays[birthdate].push({
                    year: insideText.substring(0, 4),
                    name: insideText.substring(7)
                });
            }
        });
    } catch (err) {
        console.error(err);
    }

    const currentMonthBirthdaysArr = currentMonthBirthdays[currentDay] || [];

    const currentDayBirthdayObj = currentMonthBirthdaysArr.reduce((acc, obj) => {
        if (acc[obj.year] !== undefined) {
            acc[obj.year].push(obj.name);
        } else {
            acc[obj.year] = [obj.name];
        }
        return acc;
    }, {});

}

async function generateBirthdayEmbed() {
    const currentDayData = await _getBirthdayData();
    const embed = {
        'author': {
            'name': `Today's Birthdays ${month}/${day}`,
            'url': birthdayListObj[month].url,
            'icon_url': 'https://www.shareicon.net/data/256x256/2016/05/26/770989_birthday_512x512.png',
        },
        'color': 0xFE627F,
        'fields': [],
    };

    if (isEmptyObj(currentDayData)) {
        embed.fields.push({
            'name': 'Oh no!',
            'value': `I couldn't find any birthdays today.`,
        });
    } else {
        Object.keys(currentDayData).forEach(year => {
            embed.fields.push({
                'name': year,
                'value': currentDayData[year].map(person => `${person}\n`).join(''),
            });
        });
    }
    return embed;
};

module.exports = {
    generateBirthdayEmbed,
};
