import { MongoEntity } from "src/app/common/lib/mongo.entiy";
export declare class TypeFacilitiesEntity extends MongoEntity {
    name: {
        th: string;
        en: string;
    };
    constructor(partial: Partial<TypeFacilitiesEntity>);
}
