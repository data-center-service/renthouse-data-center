const cheerio = require('cheerio')
const fs = require('fs')
const _ = require('lodash')

const buffer = fs.readFileSync('./index.html', 'utf-8');
const $ = cheerio.load(buffer.toString())

const res = [];
$('.zu-info').each(function (i, el) {
    const desc = _.trim($(this).find('h3').text());
    const typeSizeFloorSolder = _.trim($(this).find('.details-item').first().text());
    const [type, size, floorSolder] = typeSizeFloorSolder.split('|')
    const [floor, solder] = floorSolder.split('')

    const sadad = _.trim($(this).find('.details-item').find('a').text());

    res.push({
        // desc,
        // type,
        // floor,
        // solder,
        // size,
        sadad,
    });
});

console.log(res);
