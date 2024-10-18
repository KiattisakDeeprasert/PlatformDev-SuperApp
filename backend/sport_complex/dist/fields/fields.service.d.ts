import { Model } from "mongoose";
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { Field } from "./schemas/fields.schemas";
export declare class FieldsService {
    private readonly fieldModel;
    private readonly errorBuilder;
    constructor(fieldModel: Model<Field>);
    create(createFieldDto: CreateFieldDto): Promise<Field>;
    findAll(): Promise<Field[]>;
    findOne(id: string): Promise<Field>;
    update(id: string, updateFieldDto: UpdateFieldDto): Promise<Field>;
    remove(id: string): Promise<Field>;
}
