"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSportsModule = void 0;
const common_1 = require("@nestjs/common");
const type_sports_service_1 = require("./type-sports.service");
const type_sports_controller_1 = require("./type-sports.controller");
const mongoose_1 = require("@nestjs/mongoose");
const type_sport_schemas_1 = require("./schemas/type-sport.schemas");
let TypeSportsModule = class TypeSportsModule {
};
exports.TypeSportsModule = TypeSportsModule;
exports.TypeSportsModule = TypeSportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: type_sport_schemas_1.TypeSport.name, schema: type_sport_schemas_1.TypeSportSchema },
            ]),
        ],
        controllers: [type_sports_controller_1.TypeSportsController],
        providers: [type_sports_service_1.TypeSportsService],
    })
], TypeSportsModule);
//# sourceMappingURL=type-sports.module.js.map