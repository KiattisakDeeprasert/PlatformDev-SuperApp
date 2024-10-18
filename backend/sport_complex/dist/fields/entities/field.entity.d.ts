import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TypeSport } from "src/type-sports/schemas/type-sport.schemas";
import { FieldStatus } from "../enums/field-status.enum";
export declare class FieldEntity extends MongoEntity {
    capacity: number;
    status: FieldStatus;
    type: Types.ObjectId | TypeSport | null;
    constructor(partial: Partial<FieldEntity>);
}
