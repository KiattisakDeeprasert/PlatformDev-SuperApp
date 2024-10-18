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
exports.TimeslotsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_util_1 = require("../app/common/utils/error.util");
const time_slots_schema_1 = require("./schemas/time-slots.schema");
let TimeslotsService = class TimeslotsService {
    constructor(timeslotModel) {
        this.timeslotModel = timeslotModel;
        this.errorBuilder = new error_util_1.ErrorBuilder('Timeslots');
    }
    async create(createTimeSlotDto) {
        try {
            const timeslotDoc = new this.timeslotModel(createTimeSlotDto);
            const timeslot = await timeslotDoc.save();
            return timeslot.toObject();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException(this.errorBuilder.build(error_util_1.ErrorMethod.duplicated, {
                    action: error_util_1.RequestAction.create,
                }));
            }
        }
    }
    async findAll() {
        const timeslot = await this.timeslotModel.find().lean();
        return timeslot;
    }
    async findOne(id) {
        try {
            const timeslot = await this.timeslotModel.findById(id).lean();
            if (!timeslot) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            return timeslot;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateTimeSlotDto) {
        const exists = await this.timeslotModel.exists({ _id: id });
        try {
            if (!exists) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            const options = { new: true };
            const timeslot = await this.timeslotModel
                .findByIdAndUpdate(id, updateTimeSlotDto, options)
                .lean();
            return timeslot;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException(this.errorBuilder.build(error_util_1.ErrorMethod.duplicated, {
                    action: error_util_1.RequestAction.update,
                }));
            }
            throw error;
        }
    }
    async remove(id) {
        const timeslot = await this.timeslotModel.findByIdAndDelete(id).lean();
        if (!timeslot) {
            throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
        }
        return timeslot;
    }
};
exports.TimeslotsService = TimeslotsService;
exports.TimeslotsService = TimeslotsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(time_slots_schema_1.Timeslot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TimeslotsService);
//# sourceMappingURL=time-slots.service.js.map