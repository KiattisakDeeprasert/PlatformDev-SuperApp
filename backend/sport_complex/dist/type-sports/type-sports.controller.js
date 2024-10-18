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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSportsController = void 0;
const common_1 = require("@nestjs/common");
const type_sports_service_1 = require("./type-sports.service");
const create_type_sport_dto_1 = require("./dto/create-type-sport.dto");
const update_type_sport_dto_1 = require("./dto/update-type-sport.dto");
const type_sport_entity_1 = require("./entities/type-sport.entity");
const response_util_1 = require("../app/common/utils/response.util");
let TypeSportsController = class TypeSportsController {
    constructor(typeSportsService) {
        this.typeSportsService = typeSportsService;
        this.messageBuilder = new response_util_1.MessageBuilder("TypeSports");
    }
    async create(createTypeSportDto) {
        const typeSport = await this.typeSportsService.create(createTypeSportDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.CREATED, this.messageBuilder.build(response_util_1.ResponseMethod.create), new type_sport_entity_1.TypeSportEntity(typeSport));
    }
    async findAll() {
        const typeSports = await this.typeSportsService.findAll();
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findAll), typeSports.map((typeSport) => new type_sport_entity_1.TypeSportEntity(typeSport)));
    }
    async findOne(id) {
        const typeSport = await this.typeSportsService.findOne(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findOne, { id }), new type_sport_entity_1.TypeSportEntity(typeSport));
    }
    async update(id, updateTypeSportDto) {
        const typeSport = await this.typeSportsService.update(id, updateTypeSportDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.update, { id }), new type_sport_entity_1.TypeSportEntity(typeSport));
    }
    async remove(id) {
        const typeSport = await this.typeSportsService.remove(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.remove, { id }), new type_sport_entity_1.TypeSportEntity(typeSport));
    }
};
exports.TypeSportsController = TypeSportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_type_sport_dto_1.CreateTypeSportDto]),
    __metadata("design:returntype", Promise)
], TypeSportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TypeSportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeSportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_type_sport_dto_1.UpdateTypeSportDto]),
    __metadata("design:returntype", Promise)
], TypeSportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeSportsController.prototype, "remove", null);
exports.TypeSportsController = TypeSportsController = __decorate([
    (0, common_1.Controller)('type-sports'),
    __metadata("design:paramtypes", [type_sports_service_1.TypeSportsService])
], TypeSportsController);
//# sourceMappingURL=type-sports.controller.js.map