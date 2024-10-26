import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { createResponse, MessageBuilder, ResponseMethod } from 'src/app/common/utils/response.util';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportEntity } from './entities/sport.entity';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';

@Controller('sports')
export class SportsController {
  private readonly messageBuilder = new MessageBuilder("Sport");

  constructor(private readonly SportsService: SportsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createSportDto: CreateSportDto) {
    const sport = await this.SportsService.create(createSportDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SportEntity(sport)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const sports = await this.SportsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      sports.map((Sport) => new SportEntity(Sport))
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const sport = await this.SportsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SportEntity(sport)
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSportDto: UpdateSportDto
  ) {
    const sport = await this.SportsService.update(id, updateSportDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SportEntity(sport)
    );
  }

  
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const sport = await this.SportsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SportEntity(sport)
    );
  }
}
