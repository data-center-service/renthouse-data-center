import { Injectable, HttpService } from '@nestjs/common';
import * as _ from '../util/lodash.util';
import { $ } from '../util/support.util';

@Injectable()
export class AnjukeServer {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    public async getCities() {
        return [
            {
                city: '上海',
                listUrl: `https://sh.zu.anjuke.com/fangyuan/p`,
                singleUrl: `https://sh.zu.anjuke.com/fangyuan/`,
            },
        ];
    }

    public async getListHtml(page: number, listUrl: string): Promise<string> {
        $.sleep(1000);
        const url = `${listUrl}${page}/`;
        const res = await this.httpService.get(url).toPromise();
        return res.data;
    }

    public async getSingleHtml(id: string, singleUrl: string): Promise<string> {
        $.sleep(1000);
        const url = `${singleUrl}${id}`;
        const res = await this.httpService.get(url).toPromise();
        return res.data;
    }

}