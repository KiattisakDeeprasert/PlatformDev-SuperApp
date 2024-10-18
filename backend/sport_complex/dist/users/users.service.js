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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const error_util_1 = require("../app/common/utils/error.util");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.errorBuilder = new error_util_1.ErrorBuilder("Users");
    }
    async create(registerDTO) {
        try {
            const userDoc = new this.userModel(registerDTO);
            const user = await userDoc.save();
            return user.toObject();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException(this.errorBuilder.build(error_util_1.ErrorMethod.duplicated, {
                    action: error_util_1.RequestAction.create,
                }));
            }
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.userModel.findOne({ email }).lean();
            if (!user) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound));
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        const user = await this.userModel.find().lean();
        return user;
    }
    async findOne(id) {
        try {
            const user = await this.userModel.findById(id).lean();
            if (!user) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateUserDto) {
        const exists = await this.userModel.findById({ _id: id });
        try {
            if (!exists) {
                throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
            }
            if (updateUserDto.password) {
                const salt = await bcrypt.genSalt(10);
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
            }
            const options = { new: true };
            const user = await this.userModel
                .findByIdAndUpdate(id, updateUserDto, options)
                .lean();
            return user;
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
        const user = await this.userModel.findByIdAndDelete(id).lean();
        if (!user) {
            throw new common_1.NotFoundException(this.errorBuilder.build(error_util_1.ErrorMethod.notFound, { id }));
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async updatePassword(userId, newPassword) {
        return this.userModel
            .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
            .exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map