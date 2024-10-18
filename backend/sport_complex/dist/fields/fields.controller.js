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
exports.FieldsController = void 0;
const common_1 = require("@nestjs/common");
const response_util_1 = require("../app/common/utils/response.util");
const fields_service_1 = require("./fields.service");
const create_field_dto_1 = require("./dto/create-field.dto");
const update_field_dto_1 = require("./dto/update-field.dto");
const field_entity_1 = require("./entities/field.entity");
const field_status_enum_1 = require("./enums/field-status.enum");
let FieldsController = class FieldsController {
    constructor(fieldsService) {
        this.fieldsService = fieldsService;
        this.messageBuilder = new response_util_1.MessageBuilder("Fields");
    }
    async create(createFieldDto) {
        const field = await this.fieldsService.create(createFieldDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.CREATED, this.messageBuilder.build(response_util_1.ResponseMethod.create), new field_entity_1.FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status),
        }));
    }
    async findAll() {
        const fields = await this.fieldsService.findAll();
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findAll), fields.map((field) => new field_entity_1.FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status),
        })));
    }
    async findOne(id) {
        const field = await this.fieldsService.findOne(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findOne, { id }), new field_entity_1.FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status),
        }));
    }
    async update(id, updateFieldDto) {
        const field = await this.fieldsService.update(id, updateFieldDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.update, { id }), new field_entity_1.FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status),
        }));
    }
    async remove(id) {
        const field = await this.fieldsService.remove(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.remove, { id }), new field_entity_1.FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status),
        }));
    }
    convertToFieldStatus(status) {
        if (Object.values(field_status_enum_1.FieldStatus).includes(status)) {
            return status;
        }
        throw new Error(`Invalid status value: ${status}`);
    }
};
exports.FieldsController = FieldsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_field_dto_1.CreateFieldDto]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_field_dto_1.UpdateFieldDto]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "remove", null);
exports.FieldsController = FieldsController = __decorate([
    (0, common_1.Controller)("fields"),
    __metadata("design:paramtypes", [fields_service_1.FieldsService])
], FieldsController);
//# sourceMappingURL=fields.controller.js.map