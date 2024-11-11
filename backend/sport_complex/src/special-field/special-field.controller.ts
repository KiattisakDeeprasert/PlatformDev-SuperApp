import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { SpecialFieldService } from './special-field.service';
import { CreateSpecialFieldDto } from './dto/create-special-field.dto';
import { UpdateSpecialFieldDto } from './dto/update-special-field.dto';
import { createResponse, MessageBuilder, ResponseMethod } from 'src/app/common/utils/response.util';
import { SpecialFieldEntity } from './entities/special-field.entity';

@Controller('special-field')
export class SpecialFieldController {
  private readonly messageBuilder = new MessageBuilder("SpecialField");

  constructor(private readonly specialFieldService: SpecialFieldService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createSpecialFieldDto: CreateSpecialFieldDto) {
    const specialField = await this.specialFieldService.create(createSpecialFieldDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SpecialFieldEntity(specialField)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const specialFields = await this.specialFieldService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      specialFields.map((SpecialField) => new SpecialFieldEntity(SpecialField))
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const specialField = await this.specialFieldService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SpecialFieldEntity(specialField)
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSpecialFieldDto: UpdateSpecialFieldDto
  ) {
    const specialField = await this.specialFieldService.update(id, updateSpecialFieldDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SpecialFieldEntity(specialField)
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const specialField = await this.specialFieldService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SpecialFieldEntity(specialField)
    );
  }
}
