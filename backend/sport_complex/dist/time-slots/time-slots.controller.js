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
exports.TimeslotsController = void 0;
const common_1 = require("@nestjs/common");
const time_slots_service_1 = require("./time-slots.service");
const create_time_slot_dto_1 = require("./dto/create-time-slot.dto");
const update_time_slot_dto_1 = require("./dto/update-time-slot.dto");
const response_util_1 = require("../app/common/utils/response.util");
const time_slot_entity_1 = require("./entities/time-slot.entity");
let TimeslotsController = class TimeslotsController {
    constructor(timeSlotsService) {
        this.timeSlotsService = timeSlotsService;
        this.messageBuilder = new response_util_1.MessageBuilder('Timeslots');
    }
    async create(createTimeslotDto) {
        const timeslot = await this.timeSlotsService.create(createTimeslotDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.CREATED, this.messageBuilder.build(response_util_1.ResponseMethod.create), new time_slot_entity_1.TimeslotEntity(timeslot));
    }
    async findAll() {
        const timeslots = await this.timeSlotsService.findAll();
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findAll), timeslots.map((timeslot) => new time_slot_entity_1.TimeslotEntity(timeslot)));
    }
    async findOne(id) {
        const timeslot = await this.timeSlotsService.findOne(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.findOne, { id }), new time_slot_entity_1.TimeslotEntity(timeslot));
    }
    async update(id, updateTimeslotDto) {
        const timeslot = await this.timeSlotsService.update(id, updateTimeslotDto);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.update, { id }), new time_slot_entity_1.TimeslotEntity(timeslot));
    }
    async remove(id) {
        const timeslot = await this.timeSlotsService.remove(id);
        return (0, response_util_1.createResponse)(common_1.HttpStatus.OK, this.messageBuilder.build(response_util_1.ResponseMethod.remove, { id }), new time_slot_entity_1.TimeslotEntity(timeslot));
    }
};
exports.TimeslotsController = TimeslotsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_time_slot_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_slot_dto_1.UpdateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimeslotsController.prototype, "remove", null);
exports.TimeslotsController = TimeslotsController = __decorate([
    (0, common_1.Controller)('time-slots'),
    __metadata("design:paramtypes", [time_slots_service_1.TimeslotsService])
], TimeslotsController);
//# sourceMappingURL=time-slots.controller.js.map