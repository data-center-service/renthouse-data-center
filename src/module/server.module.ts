import { HttpModule, Module } from '@nestjs/common';
import { AnjukeServer } from '../server/anjuke.server';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        AnjukeServer,
    ],
    exports: [
        AnjukeServer,
    ],
})
export class ServerModule { }
