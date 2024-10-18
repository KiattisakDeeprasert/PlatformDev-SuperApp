"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeslotEntity = void 0;
const mongo_entiy_1 = require("../../app/common/lib/mongo.entiy");
class TimeslotEntity extends mongo_entiy_1.MongoEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
}
exports.TimeslotEntity = TimeslotEntity;
//# sourceMappingURL=time-slot.entity.js.map