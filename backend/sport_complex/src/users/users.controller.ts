import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDTO } from './dto/register.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() registerDTO: RegisterDTO) {
    return this.usersService.create(registerDTO);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const user = this.usersService.findByEmail(req.user.email);
    return user;
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

function AuthGuard(arg0: string): Function | import("@nestjs/common").CanActivate {
  throw new Error('Function not implemented.');
}
