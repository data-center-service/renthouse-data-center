import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../provider/config/config.service';
import { RentHouseDao } from '../dao/rent_house.dao';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'mongodb',
                    host: configService.get('MONGO_HOST'),
                    port: configService.MONGO_PORT,
                    database: configService.get('MONGO_DB'),
                    entities: [__dirname + '/../model/**/*.model{.ts,.js}'],
                    useNewUrlParser: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [RentHouseDao],
    exports: [RentHouseDao],
})
export class DaoModule { }
