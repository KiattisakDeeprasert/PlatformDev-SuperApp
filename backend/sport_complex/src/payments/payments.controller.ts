import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { FileInterceptor } from '@nestjs/platform-express';

const paymentImageUploadInterCepters = FileInterceptor('paymentImage', {
  storage: storageConfig,
});

@Controller('payments')
export class PaymentsController {
  private readonly messageBuilder = new MessageBuilder('Payment');

  constructor(private readonly paymentsService: PaymentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new PaymentEntity(payment),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const payments = await this.paymentsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      payments.map((payment) => new PaymentEntity(payment)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new PaymentEntity(payment),
    );
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "jpeg|png" })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ): Promise<any> {
    console.log("Uploaded file:", file); // Log the file object
    if (!file) {
      throw new BadRequestException("File is required");
    }
  
    const paymentImage = file?.filename;
    console.log("Payment image filename:", paymentImage); // Log the filename
    const dtoWithPhoto = { ...updatePaymentDto, paymentImage };
    const payment = await this.paymentsService.update(id, dtoWithPhoto);
  
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new PaymentEntity(payment)
    );
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const payment = await this.paymentsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new PaymentEntity(payment),
    );
  }
}
