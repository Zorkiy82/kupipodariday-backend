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

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  updateMe(@Req() { user }: Request, @Body() updateUserDto: UpdateUserDto) {
    const { id } = user as { id: number };
    return this.usersService.updateMe(id, updateUserDto);
  }

  @Get('/me')
  async getMe(@Req() { user }: Request) {
    const { id } = user as { id: number };
    return this.usersService.findMe(id);
  }

  @Get('/me/wishes')
  async getMeWishes(@Req() { user }: Request) {
    const { id } = user as { id: number };
    return this.usersService.findMeWishes(id);
  }

  @Post('/find')
  findByQuery(@Body() { query }: FindByQueryDto) {
    return this.usersService.findByQuery(query);
  }

  @Get('/:username')
  getUserByName(@Param('username') userName: string) {
    return this.usersService.findUserByName(userName);
  }
}
