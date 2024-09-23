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
exports.TypeFacilitiesSchema = exports.TypeFacilities = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let TypeFacilities = class TypeFacilities {
};
exports.TypeFacilities = TypeFacilities;
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        th: { type: String, required: true },
        en: { type: String, required: true },
    })),
    __metadata("design:type", Object)
], TypeFacilities.prototype, "name", void 0);
exports.TypeFacilities = TypeFacilities = __decorate([
    (0, mongoose_1.Schema)()
], TypeFacilities);
exports.TypeFacilitiesSchema = mongoose_1.SchemaFactory.createForClass(TypeFacilities);
exports.TypeFacilitiesSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
exports.TypeFacilitiesSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
//# sourceMappingURL=type-facilities.schema.js.map