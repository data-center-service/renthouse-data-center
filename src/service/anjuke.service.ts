import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from '../util/dayjs.util';
import * as _ from '../util/lodash.util';
import { AnjukeServer } from '../server/anjuke.server';
import * as cheerio from 'cheerio';
import { RentHouseDao } from '../dao/rent_house.dao';
import { RentHouse } from '../model/rent_house.model';

@Injectable()
export class AnjukeService {

    constructor(
        private readonly anjukeServer: AnjukeServer,
        private readonly rentHouseDao: RentHouseDao,
    ) { }

    protected resolveSingle(html: string) {
        const C = cheerio.load(html);

        const houseNoPublishDate = C('.mod-title').find('.right-info').text();
        const [tmp1, publishDate] = houseNoPublishDate.split('，发布时间：');

        const lngReg = new RegExp(/(?<=lng:)[0-9\.]+/);
        const latReg = new RegExp(/(?<=lat:)[0-9\.]+/);
        const longitude = lngReg.exec(html);
        const latitude = latReg.exec(html);

        const res = {
            publishDate,
            latitude: latitude ? latitude[0] : undefined,
            longitude: longitude ? longitude[0] : undefined,
        };

        Logger.log(res);

        return res;
    }

    protected resolveList(date: string, page: number, html: string) {
        const res: RentHouse[] = [];

        const C = cheerio.load(html);
        const currentPage = Number(C('.curr').text());
        if (page !== currentPage) {
            console.log('到达最后一页');
            return null;
        }

        C('.zu-itemmod').each(function(i, el) {
            const desc = _.trim(C(this).find('.zu-info').find('h3').text());
            const typeSizeFloorSolder = _.trim(C(this).find('.zu-info').find('.details-item').first().text());
            const [type, size, floorSolder] = typeSizeFloorSolder.split('|');
            const [floor, solder] = floorSolder.split('');
            const communityAddress = _.trim(C(this).find('.zu-info').find('address').after('a').text());
            const [community, address] = communityAddress.split('\n').map(v => _.trim(v));
            const pricePriceUnit = _.trim(C(this).find('.zu-side').find('p').after('strong').text());
            const [price, priceUnit] = pricePriceUnit.split(' ');
            const mode = _.trim(C(this).find('.zu-info').find('.details-item').find('.cls-1').text());
            const face = _.trim(C(this).find('.zu-info').find('.details-item').find('.cls-2').text());
            const subway = _.trim(C(this).find('.zu-info').find('.details-item').find('.cls-3').text());
            const url = _.trim(C(this).find('.zu-info').find('h3').find('a').attr('href'));
            const id = url.split('/').pop();

            if (!id) return null;
            res.push({
                // id: $.makeObjectId(),
                openId: id,
                date,
                community,
                price,
                data: {
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
                },
            });
        });

        Logger.log(JSON.stringify(res.map(v => v.community)));
        return res;
    }

    public async bulkUpsert() {
        const date = dayjs().format('YYYY-MM-DD');

        const cities = await this.anjukeServer.getCities();
        for (const city of cities) {
            for (const page of _.range(1, 10000)) {
                let rentHouses: RentHouse[] | null = [];

                Logger.log(`正在抓取${city.city} 第${page}页`);
                const listHtml = await this.anjukeServer.getListHtml(page, city.listUrl);
                Logger.log(`抓取${city.city}完毕 第${page}页`);
                rentHouses = this.resolveList(date, page, listHtml);
                for (const rentHouse of rentHouses || []) {
                    Logger.log(`正在抓取${city.city}补充数据 ${rentHouse.community} 第${page}页`);
                    const singleHtml = await this.anjukeServer.getSingleHtml(rentHouse.openId, city.singleUrl);
                    Logger.log(`抓取完毕${city.city}补充数据 ${rentHouse.community} 第${page}页`);
                    const resultAppend = this.resolveSingle(singleHtml);
                    Object.assign(rentHouse.data, resultAppend);
                    Logger.log(`解析完毕${city.city}补充数据 ${rentHouse.community} 第${page}页`);
                }
                Logger.log(`解析${city.city}完毕 第${page}页`);

                if (rentHouses === null) {
                    Logger.log(`${city.city}全部读取完毕`);
                    break;
                }

                const tasks: Promise<any>[] = [];
                for (const rentHouse of rentHouses) {
                    const task = this.rentHouseDao.upsert({
                        openId: rentHouse.openId,
                        date: rentHouse.date,
                    }, {
                            community: rentHouse.community,
                            data: rentHouse.data,
                            price: rentHouse.price,
                            openId: rentHouse.openId,
                            date: rentHouse.date,
                        });
                    tasks.push(task);
                }
                console.log(tasks.length);
                await Promise.all(tasks);
            }
        }
    }

}