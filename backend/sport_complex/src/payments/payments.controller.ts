import {
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
} from "@nestjs/common";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaymentEntity } from "./entities/payment.entity";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { storageConfig } from "src/app/config/storage.config";
import { FileInterceptor } from "@nestjs/platform-express";

const paymentImageUploadInterCepters = FileInterceptor('paymentImage', {
  storage: storageConfig,
});

@Controller("payments")
export class PaymentsController {
  private readonly messageBuilder = new MessageBuilder("Payment");

  constructor(private readonly paymentsService: PaymentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new PaymentEntity(payment)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const payments = await this.paymentsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      payments.map((payment) => new PaymentEntity(payment))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const payment = await this.paymentsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new PaymentEntity(payment)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    const payment = await this.paymentsService.update(
      id,
      updatePaymentDto
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new PaymentEntity(payment)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const payment = await this.paymentsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new PaymentEntity(payment)
    );
  }
}