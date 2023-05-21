import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { sign as jwtSign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SigninUserDto } from 'src/auth/dto/signin-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await bcryptHash(newUser.password, 10);

    const { password, ...user } = await this.userRepository.save(newUser);
    return user;
    // return await this.userRepository.find({ where: [{ id: 11 }, { id: 14 }] });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(signinUserDto: SigninUserDto) {
    const { username, password } = signinUserDto;
    const res = await this.userRepository.findOne({
      select: { password: true, username: true, email: true, id: true },
      where: [{ email: username }, { username: username }],
    });

    if (!res) {
      throw new ConflictException('Некорректная пара логин и пароль');
    }
    const isMatches = await bcryptCompare(password, res.password);
    if (!isMatches) {
      throw new ConflictException('Некорректная пара логин и пароль');
    }

    const token = jwtSign(
      {
        id: res.id,
      },
      'some-secret-key',
      {
        expiresIn: '7d',
      },
    );

    // console.log(res);
    return { access_token: token };
  }
}
