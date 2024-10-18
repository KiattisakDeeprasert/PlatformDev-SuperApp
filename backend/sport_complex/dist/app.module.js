"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const platform_express_1 = require("@nestjs/platform-express");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = require("./app/config/configuration");
const storage_config_1 = require("./app/config/storage.config");
const path_1 = require("path");
const fields_module_1 = require("./fields/fields.module");
const users_module_1 = require("./users/users.module");
const time_slots_module_1 = require("./time-slots/time-slots.module");
const payments_module_1 = require("./payments/payments.module");
const reservations_module_1 = require("./reservations/reservations.module");
const field_time_slots_module_1 = require("./field-time-slots/field-time-slots.module");
const type_sports_module_1 = require("./type-sports/type-sports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default]
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('database'),
                }),
            }),
            serve_static_1.ServeStaticModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                        serveRoot: config.get('upload.apiPath'),
                    },
                ],
            }),
            platform_express_1.MulterModule.register({ storage: storage_config_1.storageConfig }),
            fields_module_1.FieldsModule,
            users_module_1.UsersModule,
            time_slots_module_1.TimeSlotsModule,
            payments_module_1.PaymentsModule,
            reservations_module_1.ReservationsModule,
            type_sports_module_1.TypeSportsModule,
            field_time_slots_module_1.FieldTimeSlotsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map