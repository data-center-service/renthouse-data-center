import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class RentHouse {

    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    openId: string;

    @Column()
    community: string;

    @Column()
    price: string;

    @Column()
    date: string;

    @Column('json')
    data: any;

}