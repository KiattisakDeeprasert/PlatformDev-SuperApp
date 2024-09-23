import { HydratedDocument } from 'mongoose';
export type TypeFacilitiesDocument = HydratedDocument<TypeFacilities>;
export declare class TypeFacilities {
    name: {
        th: string;
        en: string;
    };
}
export declare const TypeFacilitiesSchema: import("mongoose").Schema<TypeFacilities, import("mongoose").Model<TypeFacilities, any, any, any, import("mongoose").Document<unknown, any, TypeFacilities> & TypeFacilities & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TypeFacilities, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<TypeFacilities>> & import("mongoose").FlatRecord<TypeFacilities> & {
    _id: import("mongoose").Types.ObjectId;
}>;
