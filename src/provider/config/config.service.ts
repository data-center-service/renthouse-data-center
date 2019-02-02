import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export class ConfigService {

    private readonly envConfig: { [prop: string]: string };

    constructor(filePath: string) {
        try {
            this.envConfig = dotenv.parse(fs.readFileSync(filePath));
        } catch (e) {
            Logger.log('env文件读取失败');
            this.envConfig = {};
        }
    }

    get MONGO_PORT(): number {
        return Number(this.get('MONGO_PORT'));
    }

    get PORT(): number {
        return Number(this.get('PORT'));
    }

    get(key: string): string {
        const env = process.env[key];
        if (env) return env;
        return this.envConfig[key];
    }

}

export const ConfigStaticService = new ConfigService('config/default.env');