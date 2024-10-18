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
exports.FieldsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_util_1 = require("../app/common/utils/error.util");
const fields_schemas_1 = require("./schemas/fields.schemas");
const POPULATE_PIPE = [
    {
        path: "type",
        select: ["name.th", "name.en"],
    },
];
let FieldsService = class FieldsService {
    constructor(fieldModel) {
        this.fieldModel = fieldModel;
        this.errorBuilder = new error_util_1.ErrorBuilder("Fields");
    }
    async create(createFieldDto) {
        try {
            const fieldDoc = new this.fieldModel(createFieldDto);
            const field = await fieldDoc.save();
            return field.toObject();
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
        const field = await this.fieldModel.find().populate(POPULATE_PIPE).lean();
        return field;
    }
    async findOne(id) {
        try {
            const field = await this.fieldModel
                .findById(id)
                .populate(POPULATE_PIPE)
                .lean();
            if (!field) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            return field;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateFieldDto) {
        const exists = await this.fieldModel.exists({ _id: id });
        try {
            if (!exists) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            const options = { new: true };
            const field = await this.fieldModel
                .findByIdAndUpdate(id, updateFieldDto, options)
                .lean();
            return field;
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
        const field = await this.fieldModel.findByIdAndDelete(id).lean();
        if (!field) {
            throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
        }
        return field;
    }
};
exports.FieldsService = FieldsService;
exports.FieldsService = FieldsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fields_schemas_1.Field.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FieldsService);
//# sourceMappingURL=fields.service.js.map