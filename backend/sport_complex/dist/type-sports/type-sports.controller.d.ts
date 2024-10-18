import { TypeSportsService } from './type-sports.service';
import { CreateTypeSportDto } from './dto/create-type-sport.dto';
import { UpdateTypeSportDto } from './dto/update-type-sport.dto';
import { TypeSportEntity } from './entities/type-sport.entity';
export declare class TypeSportsController {
    private readonly typeSportsService;
    private readonly messageBuilder;
    constructor(typeSportsService: TypeSportsService);
    create(createTypeSportDto: CreateTypeSportDto): Promise<import("../app/common/dto/response.dto").ResponseDto<TypeSportEntity>>;
    findAll(): Promise<import("../app/common/dto/response.dto").ResponseDto<TypeSportEntity[]>>;
    findOne(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<TypeSportEntity>>;
    update(id: string, updateTypeSportDto: UpdateTypeSportDto): Promise<import("../app/common/dto/response.dto").ResponseDto<TypeSportEntity>>;
    remove(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<TypeSportEntity>>;
}
