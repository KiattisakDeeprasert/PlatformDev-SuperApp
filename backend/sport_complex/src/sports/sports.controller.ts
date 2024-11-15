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
  ParseFilePipeBuilder,
  Req,
  UploadedFile,
} from '@nestjs/common';

import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportEntity } from './entities/sport.entity';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/app/common/dto/response.dto';

const sportImageUploadInterCepters = FileInterceptor('sportImage', {
  storage: storageConfig,
});

@Controller('sports')
export class SportsController {
  private readonly messageBuilder = new MessageBuilder('Sport');

  constructor(private readonly sportsService: SportsService) {}

  @UseInterceptors(ClassSerializerInterceptor, sportImageUploadInterCepters)
  @Post()
  async create(
    @Body() createSportDto: CreateSportDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg|png' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    const sportImage = file?.filename;

    const sport = await this.sportsService.create({
      ...createSportDto,
      sportImage,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SportEntity(sport),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const sports = await this.sportsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      sports.map((Sport) => new SportEntity(Sport)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sport = await this.sportsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SportEntity(sport),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, sportImageUploadInterCepters)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSportDto: UpdateSportDto,
    @Req() req: Request,
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
    const sportImage = file?.filename;
    const dtoWithPhoto = { ...updateSportDto, sportImage };
    const sport = await this.sportsService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SportEntity(sport)
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const sport = await this.sportsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SportEntity(sport),
    );
  }
}
