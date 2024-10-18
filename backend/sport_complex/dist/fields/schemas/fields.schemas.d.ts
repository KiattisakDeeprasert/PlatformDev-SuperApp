import { HydratedDocument, Types } from 'mongoose';
import { TypeSport } from 'src/type-sports/schemas/type-sport.schemas';
export type FieldsDocument = HydratedDocument<Field>;
export declare class Field {
    capacity: number;
    type: TypeSport | Types.ObjectId;
    status: string;
}
export declare const FieldSchema: import("mongoose").Schema<Field, import("mongoose").Model<Field, any, any, any, import("mongoose").Document<unknown, any, Field> & Field & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Field, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Field>> & import("mongoose").FlatRecord<Field> & {
    _id: Types.ObjectId;
}>;
