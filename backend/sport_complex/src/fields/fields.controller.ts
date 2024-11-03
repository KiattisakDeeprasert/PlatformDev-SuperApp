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
} from '@nestjs/common';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FieldEntity } from './entities/field.entity';
import { FieldStatus } from './enums/field-status.enum';

@Controller('fields')
export class FieldsController {
  private readonly messageBuilder = new MessageBuilder('Field');

  constructor(private readonly fieldsService: FieldsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createFieldDto: CreateFieldDto) {
    const field = await this.fieldsService.create(createFieldDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new FieldEntity(field),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const fields = await this.fieldsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      fields.map(
        (field) =>
          new FieldEntity({
            ...field,
            status: this.convertToFieldStatus(field.status), // Ensure status is converted to enum
          }),
      ),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const field = await this.fieldsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new FieldEntity({
        ...field,
        status: this.convertToFieldStatus(field.status), // Ensure status is converted to enum
      }),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    const field = await this.fieldsService.update(id, updateFieldDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new FieldEntity({
        ...field,
        status: this.convertToFieldStatus(field.status), // Ensure status is converted to enum
      }),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const field = await this.fieldsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new FieldEntity({
        ...field,
        status: this.convertToFieldStatus(field.status), // Ensure status is converted to enum
      }),
    );
  }

  /**
   * Helper function to convert a string status to FieldStatus enum.
   */
  private convertToFieldStatus(status: string): FieldStatus {
    if (Object.values(FieldStatus).includes(status as FieldStatus)) {
      return status as FieldStatus;
    }
    throw new Error(`Invalid status value: ${status}`);
  }
}
