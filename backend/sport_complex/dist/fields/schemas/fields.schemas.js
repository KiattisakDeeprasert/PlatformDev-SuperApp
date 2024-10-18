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
exports.FieldSchema = exports.Field = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Field = class Field {
};
exports.Field = Field;
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Field.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId,
        ref: "TypeSport",
        required: true, }),
    __metadata("design:type", Object)
], Field.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Field.prototype, "status", void 0);
exports.Field = Field = __decorate([
    (0, mongoose_1.Schema)()
], Field);
exports.FieldSchema = mongoose_1.SchemaFactory.createForClass(Field);
exports.FieldSchema.index({ field: 1, type: 1 }, { unique: true });
exports.FieldSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
exports.FieldSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
//# sourceMappingURL=fields.schemas.js.map