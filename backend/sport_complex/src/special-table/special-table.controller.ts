import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseInterceptors, HttpStatus } from '@nestjs/common';
import { SpecialTableService } from './special-table.service';
import { CreateSpecialTableDto } from './dto/create-special-table.dto';
import { UpdateSpecialTableDto } from './dto/update-special-table.dto';
import { createResponse, MessageBuilder, ResponseMethod } from 'src/app/common/utils/response.util';
import { SpecialTableEntity } from './entities/special-table.entity';

@Controller('special-table')
export class SpecialTableController {
  private readonly messageBuilder = new MessageBuilder("FieldTimeSlot");

  constructor(private readonly specialTableService: SpecialTableService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createSpecialTableDto: CreateSpecialTableDto) {
    const specialTable = await this.specialTableService.create(
      createSpecialTableDto
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SpecialTableEntity(specialTable)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const specialTables = await this.specialTableService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      specialTables.map((specialTable) => new SpecialTableEntity(specialTable))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const specialTables = await this.specialTableService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SpecialTableEntity(specialTables)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSpecialTableDto: UpdateSpecialTableDto
  ) {
    const specialTable = await this.specialTableService.update(
      id,
      updateSpecialTableDto
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SpecialTableEntity(specialTable)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const specialTable = await this.specialTableService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SpecialTableEntity(specialTable)
    );
  }
}
