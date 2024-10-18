"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSportEntity = void 0;
const mongo_entiy_1 = require("../../app/common/lib/mongo.entiy");
class TypeSportEntity extends mongo_entiy_1.MongoEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
}
exports.TypeSportEntity = TypeSportEntity;
//# sourceMappingURL=type-sport.entity.js.map