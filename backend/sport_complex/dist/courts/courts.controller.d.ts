import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
export declare class CourtsController {
    private readonly courtsService;
    constructor(courtsService: CourtsService);
    create(createCourtDto: CreateCourtDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCourtDto: UpdateCourtDto): string;
    remove(id: string): string;
}
