import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { PaymentSpecialService } from './payment-special.service';
import { CreatePaymentSpecialDto } from './dto/create-payment-special.dto';
import { UpdatePaymentSpecialDto } from './dto/update-payment-special.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { PaymentSpecialEntity } from './entities/payment-special.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';

const paymentImageUploadInterCepters = FileInterceptor('paymentImage', {
  storage: storageConfig,
});

@Controller('payment-special')
export class PaymentSpecialController {
  private readonly messageBuilder = new MessageBuilder('Payment');

  constructor(private readonly paymentSpecialService: PaymentSpecialService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createPaymentSpecialDto: CreatePaymentSpecialDto) {
    const paymentSpecial = await this.paymentSpecialService.create(
      createPaymentSpecialDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new PaymentSpecialEntity(paymentSpecial),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const paymentSpecials = await this.paymentSpecialService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      paymentSpecials.map(
        (paymentSpecial) => new PaymentSpecialEntity(paymentSpecial),
      ),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paymentSpecial = await this.paymentSpecialService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new PaymentSpecialEntity(paymentSpecial),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, paymentImageUploadInterCepters)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentSpecialDto: UpdatePaymentSpecialDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg|png' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const paymentImage = file?.filename;
    const dtoWithPhoto = { ...updatePaymentSpecialDto, paymentImage };
    const payment = await this.paymentSpecialService.update(id, dtoWithPhoto);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new PaymentSpecialEntity(payment),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const paymentSpecial = await this.paymentSpecialService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new PaymentSpecialEntity(paymentSpecial),
    );
  }
}
