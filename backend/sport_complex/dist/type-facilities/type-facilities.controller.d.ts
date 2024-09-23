import { TypeFacilitiesService } from './type-facilities.service';
import { CreateTypeFacilitiesDto } from './dto/create-type-facilitiesdto';
import { UpdateTypeFacilitiesDto } from './dto/update-type-facilities.dto';
export declare class TypeFacilitiesController {
    private readonly typeFacilitiesService;
    constructor(typeFacilitiesService: TypeFacilitiesService);
    create(createTypeFacilitiesDto: CreateTypeFacilitiesDto): Promise<import("./schemas/type-facilities.schema").TypeFacilities>;
    findAll(): Promise<import("./schemas/type-facilities.schema").TypeFacilities[]>;
    findOne(id: string): Promise<import("./schemas/type-facilities.schema").TypeFacilities>;
    update(id: string, updateTypeFacilitiesDto: UpdateTypeFacilitiesDto): Promise<import("./schemas/type-facilities.schema").TypeFacilities>;
    remove(id: string): Promise<import("./schemas/type-facilities.schema").TypeFacilities>;
}
