import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentSpecialDto } from './create-payment-special.dto';

export class UpdatePaymentSpecialDto extends PartialType(CreatePaymentSpecialDto) {}
