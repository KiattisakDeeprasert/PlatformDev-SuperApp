import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { ComplexReservationsService } from './complex-reservations.service';
import { CreateComplexReservationDto } from './dto/create-complex-reservation.dto';
import { UpdateComplexReservationDto } from './dto/update-complex-reservation.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { ComplexReservationEntity } from './entities/complex-reservation.entity';

@Controller('complex-reservations')
export class ComplexReservationsController {
  private readonly messageBuilder = new MessageBuilder('Complex-Reservation');

  constructor(
    private readonly complexReservationsService: ComplexReservationsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Body() createComplexReservationDto: CreateComplexReservationDto,
  ) {
    const complexreservation = await this.complexReservationsService.create(
      createComplexReservationDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ComplexReservationEntity(complexreservation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const complexreservations = await this.complexReservationsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      complexreservations.map(
        (complexreservation) => new ComplexReservationEntity(complexreservation),
      ),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const complexreservation = await this.complexReservationsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ComplexReservationEntity(complexreservation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComplexReservationDto: UpdateComplexReservationDto,
  ) {
    const complexreservation = await this.complexReservationsService.update(
      id,
      updateComplexReservationDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ComplexReservationEntity(complexreservation),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const complexreservation = await this.complexReservationsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ComplexReservationEntity(complexreservation),
    );
  }
}
