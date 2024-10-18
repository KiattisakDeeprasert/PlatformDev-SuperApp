import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;
}
