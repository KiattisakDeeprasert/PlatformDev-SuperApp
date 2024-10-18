import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
export declare class TimeslotEntity extends MongoEntity {
    start: string;
    end: string;
    constructor(partial: Partial<TimeslotEntity>);
}
