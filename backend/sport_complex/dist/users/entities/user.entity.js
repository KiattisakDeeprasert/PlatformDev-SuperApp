"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const mongo_entiy_1 = require("../../app/common/lib/mongo.entiy");
class UserEntity extends mongo_entiy_1.MongoEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map