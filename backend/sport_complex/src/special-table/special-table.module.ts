import { Module } from '@nestjs/common';
import { SpecialTableService } from './special-table.service';
import { SpecialTableController } from './special-table.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialTable, SpecialTableSchema } from './schemas/special-table.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialTable.name, schema: SpecialTableSchema },
    ]),
  ],
  controllers: [SpecialTableController],
  providers: [SpecialTableService],
  exports: [MongooseModule],
})
export class SpecialTableModule {}
