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
exports.TypeFacilitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const type_facilities_schema_1 = require("./schemas/type-facilities.schema");
const error_util_1 = require("../app/common/utils/error.util");
let TypeFacilitiesService = class TypeFacilitiesService {
    constructor(typeFacilitiesModel) {
        this.typeFacilitiesModel = typeFacilitiesModel;
        this.errorBuilder = new error_util_1.ErrorBuilder('Type-Facilities');
    }
    async create(createTypeFacilitiesDto) {
        try {
            const typeFacilitiesDoc = new this.typeFacilitiesModel(createTypeFacilitiesDto);
            const typeFacilities = await typeFacilitiesDoc.save();
            return typeFacilities.toObject();
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
        const typeFacilities = await this.typeFacilitiesModel.find().lean();
        return typeFacilities;
    }
    async findOne(id) {
        try {
            const typeFacilities = await this.typeFacilitiesModel.findById(id).lean();
            if (!typeFacilities) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            return typeFacilities;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateTypeFacilitiesDto) {
        const exists = await this.typeFacilitiesModel.exists({ _id: id });
        try {
            if (!exists) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            const options = { new: true };
            const typeFacilities = await this.typeFacilitiesModel
                .findByIdAndUpdate(id, updateTypeFacilitiesDto, options)
                .lean();
            return typeFacilities;
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
        const typeFacilities = await this.typeFacilitiesModel
            .findByIdAndDelete(id)
            .lean();
        if (!typeFacilities) {
            throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
        }
        return typeFacilities;
    }
};
exports.TypeFacilitiesService = TypeFacilitiesService;
exports.TypeFacilitiesService = TypeFacilitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(type_facilities_schema_1.TypeFacilities.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TypeFacilitiesService);
//# sourceMappingURL=type-facilities.service.js.map