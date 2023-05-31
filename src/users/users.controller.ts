import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindByQueryDto } from './dto/find-by-query.dto';
import { TUserData } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/find')
  findByQuery(@Body() { query }: FindByQueryDto) {
    return this.usersService.findByQuery(query);
  }

  @Get('/me')
  async getMe(@Req() { user }: Request) {
    const { id } = user as TUserData;
    return this.usersService.findMe(id);
  }

  @Patch('/me')
  updateMe(@Req() { user }: Request, @Body() updateUserDto: UpdateUserDto) {
    const { id } = user as TUserData;
    return this.usersService.updateMe(id, updateUserDto);
  }

  @Get('/me/wishes')
  async getMeWishes(@Req() { user }: Request) {
    const { id } = user as TUserData;
    return this.usersService.findWishesByOptions('id', id);
  }

  @Get('/:username/wishes')
  getWishesByUserName(@Param('username') userName: string) {
    return this.usersService.findWishesByOptions('username', userName);
  }

  @Get('/:username')
  geTUserDataByName(@Param('username') userName: string) {
    return this.usersService.findUserByName(userName);
  }
}
