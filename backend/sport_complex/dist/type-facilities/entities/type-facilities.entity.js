"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeFacilitiesEntity = void 0;
const mongo_entiy_1 = require("../../app/common/lib/mongo.entiy");
class TypeFacilitiesEntity extends mongo_entiy_1.MongoEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
}
exports.TypeFacilitiesEntity = TypeFacilitiesEntity;
//# sourceMappingURL=type-facilities.entity.js.map