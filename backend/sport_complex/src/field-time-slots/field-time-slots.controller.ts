import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { FieldTimeSlotsService } from "./field-time-slots.service";
import { FieldTimeSlotEntity } from "./entities/field-time-slot.entity";
import { CreateFieldTimeSlotDto } from "./dto/create-field-time-slot.dto";
import { UpdateFieldTimeSlotDto } from "./dto/update-field-time-slot.dto";

@Controller("field-timeslots")
export class FieldTimeSlotsController {
  private readonly messageBuilder = new MessageBuilder("FieldTimeSlot");

  constructor(private readonly fieldTimeSlotsService: FieldTimeSlotsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createFieldTimeslotDto: CreateFieldTimeSlotDto) {
    const fieldTimeSlot = await this.fieldTimeSlotsService.create(
      createFieldTimeslotDto
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new FieldTimeSlotEntity(fieldTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const fieldTimeSlots = await this.fieldTimeSlotsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      fieldTimeSlots.map((fieldTimeSlot) => new FieldTimeSlotEntity(fieldTimeSlot))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const fieldTimeSlot = await this.fieldTimeSlotsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new FieldTimeSlotEntity(fieldTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateFieldTimeslotDto: UpdateFieldTimeSlotDto
  ) {
    const fieldTimeSlot = await this.fieldTimeSlotsService.update(
      id,
      updateFieldTimeslotDto
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new FieldTimeSlotEntity(fieldTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const fieldTimeSlot = await this.fieldTimeSlotsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new FieldTimeSlotEntity(fieldTimeSlot)
    );
  }
}