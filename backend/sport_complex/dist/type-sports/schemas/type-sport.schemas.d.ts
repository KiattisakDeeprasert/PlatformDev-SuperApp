import { HydratedDocument } from 'mongoose';
export type TypeSportDocument = HydratedDocument<TypeSport>;
export declare class TypeSport {
    name: {
        th: string;
        en: string;
    };
}
export declare const TypeSportSchema: import("mongoose").Schema<TypeSport, import("mongoose").Model<TypeSport, any, any, any, import("mongoose").Document<unknown, any, TypeSport> & TypeSport & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TypeSport, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<TypeSport>> & import("mongoose").FlatRecord<TypeSport> & {
    _id: import("mongoose").Types.ObjectId;
}>;
