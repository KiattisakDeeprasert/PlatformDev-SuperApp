import { Model } from "mongoose";
import { RegisterDTO } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
export declare class UsersService {
    private userModel;
    private readonly errorBuilder;
    constructor(userModel: Model<User>);
    create(registerDTO: RegisterDTO): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    updatePassword(userId: string, newPassword: string): Promise<User>;
}
