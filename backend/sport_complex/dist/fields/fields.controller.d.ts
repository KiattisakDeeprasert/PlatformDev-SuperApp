import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FieldEntity } from "./entities/field.entity";
export declare class FieldsController {
    private readonly fieldsService;
    private readonly messageBuilder;
    constructor(fieldsService: FieldsService);
    create(createFieldDto: CreateFieldDto): Promise<import("../app/common/dto/response.dto").ResponseDto<FieldEntity>>;
    findAll(): Promise<import("../app/common/dto/response.dto").ResponseDto<FieldEntity[]>>;
    findOne(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<FieldEntity>>;
    update(id: string, updateFieldDto: UpdateFieldDto): Promise<import("../app/common/dto/response.dto").ResponseDto<FieldEntity>>;
    remove(id: string): Promise<import("../app/common/dto/response.dto").ResponseDto<FieldEntity>>;
    private convertToFieldStatus;
}
