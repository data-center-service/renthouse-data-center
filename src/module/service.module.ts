import { Module } from '@nestjs/common';
import { DaoModule } from './dao.module';
import { ServerModule } from './server.module';
import { AnjukeService } from '../service/anjuke.service';

@Module({
    imports: [
        DaoModule,
        ServerModule,
    ],
    providers: [
        AnjukeService,
    ],
    exports: [
        AnjukeService,
    ],
})
export class ServiceModule { }
