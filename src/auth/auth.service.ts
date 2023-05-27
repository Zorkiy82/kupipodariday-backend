import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import { compare as bcryptCompare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<{ id: number }> {
    const user = await this.usersService.findOneByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    const isMatches = await bcryptCompare(password, user.password);
    if (!isMatches) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return { id: user.id };
  }

  async login(user: { id: number }) {
    const payload = user;
    return { access_token: this.jwtService.sign(payload) };
  }
}
