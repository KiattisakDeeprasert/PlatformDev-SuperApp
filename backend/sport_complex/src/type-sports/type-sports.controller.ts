import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';

import { TypeSportsService } from './type-sports.service';
import { CreateTypeSportDto } from './dto/create-type-sport.dto';
import { UpdateTypeSportDto } from './dto/update-type-sport.dto';
import { TypeSportEntity } from './entities/type-sport.entity';
import { createResponse, MessageBuilder, ResponseMethod } from 'src/app/common/utils/response.util';

@Controller('type-sports')
export class TypeSportsController {
  private readonly messageBuilder = new MessageBuilder("TypeSports");

  constructor(private readonly typeSportsService: TypeSportsService) {}

  //@UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createTypeSportDto: CreateTypeSportDto) {
    const typeSport = await this.typeSportsService.create(createTypeSportDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new TypeSportEntity(typeSport)
    );
  }

  @Get()
  async findAll() {
    const typeSports = await this.typeSportsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      typeSports.map((typeSport) => new TypeSportEntity(typeSport))
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const typeSport = await this.typeSportsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new TypeSportEntity(typeSport)
    );
  }


  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTypeSportDto: UpdateTypeSportDto
  ) {
    const typeSport = await this.typeSportsService.update(id, updateTypeSportDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new TypeSportEntity(typeSport)
    );
  }


  @Delete(":id")
  async remove(@Param("id") id: string) {
    const typeSport = await this.typeSportsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new TypeSportEntity(typeSport)
    );
  }
}
