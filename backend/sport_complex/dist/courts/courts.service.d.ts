import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
export declare class CourtsService {
    create(createCourtDto: CreateCourtDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCourtDto: UpdateCourtDto): string;
    remove(id: number): string;
}
