import { forwardRef, Module } from '@nestjs/common';
import { SpecialTableService } from './special-table.service';
import { SpecialTableController } from './special-table.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialTable, SpecialTableSchema } from './schemas/special-table.schemas';
import { ComplexReservationsModule } from 'src/complex-reservations/complex-reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialTable.name, schema: SpecialTableSchema },
    ]),
    forwardRef(() => ComplexReservationsModule),
  ],
  controllers: [SpecialTableController],
  providers: [SpecialTableService],
  exports: [SpecialTableService,MongooseModule],
})
export class SpecialTableModule {}
