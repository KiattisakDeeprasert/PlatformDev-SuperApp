import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { TimeslotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { createResponse, MessageBuilder, ResponseMethod } from 'src/app/common/utils/response.util';
import { TimeslotEntity } from './entities/time-slot.entity';


@Controller('time-slots')
export class TimeslotsController {
  private readonly messageBuilder = new MessageBuilder('Timeslots');

  constructor(private readonly timeSlotsService: TimeslotsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createTimeslotDto: CreateTimeSlotDto) {
    const timeslot = await this.timeSlotsService.create(createTimeslotDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new TimeslotEntity(timeslot)
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const timeslots = await this.timeSlotsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      timeslots.map((timeslot) => new TimeslotEntity(timeslot))
    );
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const timeslot = await this.timeSlotsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new TimeslotEntity(timeslot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTimeslotDto: UpdateTimeSlotDto
  ) {
    const timeslot = await this.timeSlotsService.update(id, updateTimeslotDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new TimeslotEntity(timeslot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const timeslot = await this.timeSlotsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new TimeslotEntity(timeslot)
    );
  }
}