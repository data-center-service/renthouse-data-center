import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, FindOneOptions, FindManyOptions } from 'typeorm';
import { IType } from '../interface/type.interface';
import { RentHouse } from '../model/rent_house.model';

@Injectable()
export class RentHouseDao implements OnModuleInit {

    constructor(
        private readonly connection: Connection,
    ) { }

    async onModuleInit() {
        await this.connection.getMongoRepository(RentHouse).createCollectionIndex({
            openId: 1,
            date: -1,
        });
    }

    public async create(data: RentHouse) {
        return this.connection.getMongoRepository(RentHouse).insert(data);
    }

    public async bulkCreate(data: RentHouse[]) {
        return this.connection.getMongoRepository(RentHouse).insert(data);
    }

    public async upsert(where: Partial<RentHouse>, data: Partial<RentHouse>) {
        return this.connection.getMongoRepository(RentHouse).replaceOne(where, data, {
            upsert: true,
        });
    }

    public async findAll(option: FindOneOptions<RentHouse>) {
        return this.connection.getMongoRepository(RentHouse).find(option);
    }

    public async findOne(option: FindOneOptions<RentHouse>) {
        return this.connection.getMongoRepository(RentHouse).findOne(option);
    }

    public async findAllAndCount(option: FindManyOptions<RentHouse>) {
        return this.connection.getMongoRepository(RentHouse).findAndCount(option);
    }

}