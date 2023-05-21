import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/me')
  async getMe(@Headers() headers: HeadersObject) {
    const { authorization } = headers;

    if (!authorization || !String(authorization).startsWith('Bearer ')) {
      throw new ConflictException('Необходима авторизация');
    }

    const token = String(authorization).replace('Bearer ', '');
    const payload = await jwtVerify(token, 'some-secret-key');
    console.log(payload);
    return { data: 'Данные обомне )' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
