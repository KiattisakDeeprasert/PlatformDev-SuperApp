import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { SpecialFieldService } from './special-field.service';
import { CreateSpecialFieldDto } from './dto/create-special-field.dto';
import { UpdateSpecialFieldDto } from './dto/update-special-field.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { SpecialFieldEntity } from './entities/special-field.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import { ResponseDto } from 'src/app/common/dto/response.dto';

const specialfieldImageUploadInterCepters = FileInterceptor(
  'specialfieldImage',
  {
    storage: storageConfig,
  },
);

@Controller('special-field')
export class SpecialFieldController {
  private readonly messageBuilder = new MessageBuilder('SpecialField');

  constructor(private readonly specialFieldService: SpecialFieldService) {}

  @UseInterceptors(
    ClassSerializerInterceptor,
    specialfieldImageUploadInterCepters,
  )
  @Post()
  async create(
    @Body() createSpecialFieldDto: CreateSpecialFieldDto,
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
    const specialfieldImage = file?.filename;

    const specialfield = await this.specialFieldService.create({
      ...createSpecialFieldDto,
      specialfieldImage,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SpecialFieldEntity(specialfield),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const specialFields = await this.specialFieldService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      specialFields.map((SpecialField) => new SpecialFieldEntity(SpecialField)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const specialField = await this.specialFieldService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SpecialFieldEntity(specialField),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    specialfieldImageUploadInterCepters,
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSpecialFieldDto: UpdateSpecialFieldDto,
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
  ): Promise<any> {
    const specialfieldImage = file?.filename;
    const dtoWithPhoto = { ...updateSpecialFieldDto, specialfieldImage };
    const sport = await this.specialFieldService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SpecialFieldEntity(sport),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const specialField = await this.specialFieldService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SpecialFieldEntity(specialField),
    );
  }
}
