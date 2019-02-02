import * as uuidv4 from 'uuid/v4';
import * as _ from './lodash.util';
import { ObjectID } from 'typeorm';

class Support {

    public makeId(): string {
        return uuidv4();
    }

    public makeObjectId(): ObjectID {
        return ObjectID.createFromHexString(this.makeId());
    }

    public dataBinding(data: string, params: { [key: string]: any }) {
        const regExp = new RegExp(/{{[a-zA-Z0-9.]+}}/g);
        const matchs = data.match(regExp);
        if (!matchs) return data;
        for (const match of matchs) {
            const path = match.replace(/[{}]/g, '');
            data = data.replace(match, _.get(params, path));
        }
        return data;
    }

    /**
     * Sleep
     *
     * @param {number} time 毫秒
     * @returns
     * @memberof Support
     */
    public sleep(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

}

export const $ = new Support();