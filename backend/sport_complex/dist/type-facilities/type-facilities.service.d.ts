import { CreateTypeFacilitiesDto } from './dto/create-type-facilitiesdto';
import { UpdateTypeFacilitiesDto } from './dto/update-type-facilities.dto';
import { Model } from 'mongoose';
import { TypeFacilities } from './schemas/type-facilities.schema';
export declare class TypeFacilitiesService {
    private readonly typeFacilitiesModel;
    private readonly errorBuilder;
    constructor(typeFacilitiesModel: Model<TypeFacilities>);
    create(createTypeFacilitiesDto: CreateTypeFacilitiesDto): Promise<TypeFacilities>;
    findAll(): Promise<TypeFacilities[]>;
    findOne(id: string): Promise<TypeFacilities>;
    update(id: string, updateTypeFacilitiesDto: UpdateTypeFacilitiesDto): Promise<TypeFacilities>;
    remove(id: string): Promise<TypeFacilities>;
}
