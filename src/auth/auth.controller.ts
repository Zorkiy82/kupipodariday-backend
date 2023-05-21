import { Controller, Post, Body } from '@nestjs/common';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('/')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  login(@Body() signinUserDto: SigninUserDto) {
    return this.userService.login(signinUserDto);
  }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
