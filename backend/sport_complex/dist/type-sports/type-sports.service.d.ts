import { Model } from "mongoose";
import { TypeSport } from "./schemas/type-sport.schemas";
import { CreateTypeSportDto } from "./dto/create-type-sport.dto";
import { UpdateTypeSportDto } from "./dto/update-type-sport.dto";
export declare class TypeSportsService {
    private readonly typeSportModel;
    private readonly errorBuilder;
    constructor(typeSportModel: Model<TypeSport>);
    create(createTypeSportDto: CreateTypeSportDto): Promise<TypeSport>;
    findAll(): Promise<TypeSport[]>;
    findOne(id: string): Promise<TypeSport>;
    update(id: string, updateTypeSportDto: UpdateTypeSportDto): Promise<TypeSport>;
    remove(id: string): Promise<TypeSport>;
}
