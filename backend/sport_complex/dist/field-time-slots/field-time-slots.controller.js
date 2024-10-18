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
exports.FieldTimeSlotsController = void 0;
const common_1 = require("@nestjs/common");
const field_time_slots_service_1 = require("./field-time-slots.service");
const create_field_time_slot_dto_1 = require("./dto/create-field-time-slot.dto");
const update_field_time_slot_dto_1 = require("./dto/update-field-time-slot.dto");
let FieldTimeSlotsController = class FieldTimeSlotsController {
    constructor(fieldTimeSlotsService) {
        this.fieldTimeSlotsService = fieldTimeSlotsService;
    }
    create(createFieldTimeSlotDto) {
        return this.fieldTimeSlotsService.create(createFieldTimeSlotDto);
    }
    findAll() {
        return this.fieldTimeSlotsService.findAll();
    }
    findOne(id) {
        return this.fieldTimeSlotsService.findOne(+id);
    }
    update(id, updateFieldTimeSlotDto) {
        return this.fieldTimeSlotsService.update(+id, updateFieldTimeSlotDto);
    }
    remove(id) {
        return this.fieldTimeSlotsService.remove(+id);
    }
};
exports.FieldTimeSlotsController = FieldTimeSlotsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_field_time_slot_dto_1.CreateFieldTimeSlotDto]),
    __metadata("design:returntype", void 0)
], FieldTimeSlotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FieldTimeSlotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FieldTimeSlotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_field_time_slot_dto_1.UpdateFieldTimeSlotDto]),
    __metadata("design:returntype", void 0)
], FieldTimeSlotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FieldTimeSlotsController.prototype, "remove", null);
exports.FieldTimeSlotsController = FieldTimeSlotsController = __decorate([
    (0, common_1.Controller)('field-time-slots'),
    __metadata("design:paramtypes", [field_time_slots_service_1.FieldTimeSlotsService])
], FieldTimeSlotsController);
//# sourceMappingURL=field-time-slots.controller.js.map