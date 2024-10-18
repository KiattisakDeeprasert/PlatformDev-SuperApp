import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDTO } from './dto/register.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(registerDTO: RegisterDTO): Promise<import("./schemas/user.schema").User>;
    getProfile(req: any): Promise<import("./schemas/user.schema").User>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User>;
    remove(id: string): Promise<import("./schemas/user.schema").User>;
}
