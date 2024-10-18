"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldEntity = void 0;
const mongo_entiy_1 = require("../../app/common/lib/mongo.entiy");
const transform_id_decorator_1 = require("../../app/decorator/transform-id.decorator");
const type_sport_entity_1 = require("../../type-sports/entities/type-sport.entity");
class FieldEntity extends mongo_entiy_1.MongoEntity {
    constructor(partial) {
        super();
        Object.assign(this, partial);
    }
}
exports.FieldEntity = FieldEntity;
__decorate([
    (0, transform_id_decorator_1.TransformId)((v) => new type_sport_entity_1.TypeSportEntity(v)),
    __metadata("design:type", Object)
], FieldEntity.prototype, "type", void 0);
//# sourceMappingURL=field.entity.js.map