import { Types } from 'mongoose';
export declare abstract class MongoEntity {
    _id: string | Types.ObjectId;
    __v: string;
}
