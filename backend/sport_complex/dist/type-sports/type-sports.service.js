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
exports.TypeSportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_util_1 = require("../app/common/utils/error.util");
const type_sport_schemas_1 = require("./schemas/type-sport.schemas");
let TypeSportsService = class TypeSportsService {
    constructor(typeSportModel) {
        this.typeSportModel = typeSportModel;
        this.errorBuilder = new error_util_1.ErrorBuilder("Type-sports");
    }
    async create(createTypeSportDto) {
        try {
            const typeSportDoc = new this.typeSportModel(createTypeSportDto);
            const typeSport = await typeSportDoc.save();
            return typeSport.toObject();
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
        const typeSport = await this.typeSportModel.find().lean();
        return typeSport;
    }
    async findOne(id) {
        try {
            const typeSport = await this.typeSportModel.findById(id).lean();
            if (!typeSport) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            return typeSport;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateTypeSportDto) {
        const exists = await this.typeSportModel.exists({ _id: id });
        try {
            if (!exists) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            const options = { new: true };
            const typeSport = await this.typeSportModel
                .findByIdAndUpdate(id, updateTypeSportDto, options)
                .lean();
            return typeSport;
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
        const typeSport = await this.typeSportModel.findByIdAndDelete(id).lean();
        if (!typeSport) {
            throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
        }
        return typeSport;
    }
};
exports.TypeSportsService = TypeSportsService;
exports.TypeSportsService = TypeSportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(type_sport_schemas_1.TypeSport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TypeSportsService);
//# sourceMappingURL=type-sports.service.js.map