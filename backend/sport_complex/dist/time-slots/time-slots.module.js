"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotsModule = void 0;
const common_1 = require("@nestjs/common");
const time_slots_service_1 = require("./time-slots.service");
const time_slots_controller_1 = require("./time-slots.controller");
const mongoose_1 = require("@nestjs/mongoose");
const time_slots_schema_1 = require("./schemas/time-slots.schema");
let TimeSlotsModule = class TimeSlotsModule {
};
exports.TimeSlotsModule = TimeSlotsModule;
exports.TimeSlotsModule = TimeSlotsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: time_slots_schema_1.Timeslot.name, schema: time_slots_schema_1.TimeslotSchema },
            ]),
        ],
        controllers: [time_slots_controller_1.TimeslotsController],
        providers: [time_slots_service_1.TimeslotsService],
    })
], TimeSlotsModule);
//# sourceMappingURL=time-slots.module.js.map