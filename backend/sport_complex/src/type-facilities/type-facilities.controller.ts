import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeFacilitiesService } from './type-facilities.service';
import { CreateTypeFacilitiesDto } from './dto/create-type-facilitiesdto';
import { UpdateTypeFacilitiesDto } from './dto/update-type-facilities.dto';

@Controller('type-facilities')
export class TypeFacilitiesController {
  constructor(private readonly typeFacilitiesService: TypeFacilitiesService) {}

  @Post()
  create(@Body() createTypeFacilitiesDto: CreateTypeFacilitiesDto) {
    return this.typeFacilitiesService.create(createTypeFacilitiesDto);
  }

  @Get()
  findAll() {
    return this.typeFacilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeFacilitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeFacilitiesDto: UpdateTypeFacilitiesDto) {
    return this.typeFacilitiesService.update(id, updateTypeFacilitiesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeFacilitiesService.remove(id);
  }
}
