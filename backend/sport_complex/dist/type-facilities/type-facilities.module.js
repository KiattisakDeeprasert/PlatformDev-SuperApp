"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeFacilitiesModule = void 0;
const common_1 = require("@nestjs/common");
const type_facilities_service_1 = require("./type-facilities.service");
const type_facilities_controller_1 = require("./type-facilities.controller");
const mongoose_1 = require("@nestjs/mongoose");
const type_facilities_schema_1 = require("./schemas/type-facilities.schema");
let TypeFacilitiesModule = class TypeFacilitiesModule {
};
exports.TypeFacilitiesModule = TypeFacilitiesModule;
exports.TypeFacilitiesModule = TypeFacilitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: type_facilities_schema_1.TypeFacilities.name, schema: type_facilities_schema_1.TypeFacilitiesSchema },
            ]),
        ],
        controllers: [type_facilities_controller_1.TypeFacilitiesController],
        providers: [type_facilities_service_1.TypeFacilitiesService],
    })
], TypeFacilitiesModule);
//# sourceMappingURL=type-facilities.module.js.map