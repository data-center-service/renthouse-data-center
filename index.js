const cheerio = require('cheerio')
const _ = require('lodash')
const axios = require('axios')

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function getListHtml(page) {
    await sleep(1000)
    return axios.default.get(`https://sh.zu.anjuke.com/fangyuan/p${page}/`)
}

async function getSingleHtml(id) {
    await sleep(1000)
    return axios.default.get(`https://sh.zu.anjuke.com/fangyuan/${id}`)
}

function resolveSingle(html) {
    // 获取经纬度
    // 获取发布时间

    const $ = cheerio.load(html)

    const houseNoPublishDate = $('.mod-title').find('.right-info').text();
    const [tmp1, publishDate] = houseNoPublishDate.split('，发布时间：')

    const res = {
        publishDate,
    };
    console.log(res);

    return res;
}

function resolveList(res, page, html) {
    const $ = cheerio.load(html)
    const currentPage = Number($('.curr').text());
    if (page !== currentPage) return null;

    $('.zu-itemmod').each(function (i, el) {
        const desc = _.trim($(this).find('.zu-info').find('h3').text());
        const typeSizeFloorSolder = _.trim($(this).find('.zu-info').find('.details-item').first().text());
        const [type, size, floorSolder] = typeSizeFloorSolder.split('|')
        const [floor, solder] = floorSolder.split('')
        const communityAddress = _.trim($(this).find('.zu-info').find('address').after('a').text())
        const [community, address] = communityAddress.split('\n').map(v => _.trim(v));
        const pricePriceUnit = _.trim($(this).find('.zu-side').find('p').after('strong').text())
        const [price, priceUnit] = pricePriceUnit.split(' ')
        const mode = _.trim($(this).find('.zu-info').find('.details-item').find('.cls-1').text())
        const face = _.trim($(this).find('.zu-info').find('.details-item').find('.cls-2').text())
        const subway = _.trim($(this).find('.zu-info').find('.details-item').find('.cls-3').text())
        const url = _.trim($(this).find('.zu-info').find('h3').find('a').attr('href'))
        const id = url.split('/').pop()

        res.push({
            id,
            desc,
            type,
            floor,
            solder,
            size,
            community,
            address,
            price,
            priceUnit,
            mode,
            face,
            subway,
        });
    });

    console.log(res);
    return res;
}

async function main() {
    const objs = [];
    for (const page of _.range(1, 10000)) {
        console.log(`正在抓取 第${page}页`);
        const response = await getListHtml(page)
        console.log(`抓取完毕 第${page}页`);
        const result = resolveList(objs, page, response.data)
        for (const obj of objs) {
            console.log(`正在抓取补充数据 ${obj.id}`);
            const singleResponse = await getSingleHtml(obj.id)
            console.log(`抓取完毕补充数据 ${obj.id}`);
            resolveSingle(singleResponse.data)
            console.log(`解析完毕补充数据 ${obj.id}`);
        }
        console.log(`解析完毕 第${page}页`);
        if (result === null) {
            console.log(`全部读取完毕`);
            break
        };
    }
}

main()