import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FieldTimeSlotsService } from './field-time-slots.service';
import { CreateFieldTimeSlotDto } from './dto/create-field-time-slot.dto';
import { UpdateFieldTimeSlotDto } from './dto/update-field-time-slot.dto';

@Controller('field-time-slots')
export class FieldTimeSlotsController {
  constructor(private readonly fieldTimeSlotsService: FieldTimeSlotsService) {}

  @Post()
  create(@Body() createFieldTimeSlotDto: CreateFieldTimeSlotDto) {
    return this.fieldTimeSlotsService.create(createFieldTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.fieldTimeSlotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldTimeSlotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldTimeSlotDto: UpdateFieldTimeSlotDto) {
    return this.fieldTimeSlotsService.update(+id, updateFieldTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldTimeSlotsService.remove(+id);
  }
}
