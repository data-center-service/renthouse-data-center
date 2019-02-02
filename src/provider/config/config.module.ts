import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService('config/default.env'),
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule { }