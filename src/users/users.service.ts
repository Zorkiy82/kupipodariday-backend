import { Injectable } from '@nestjs/common';
import { hash as bcryptHash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository, ILike } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  findAll(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    newUser.password = await bcryptHash(newUser.password, 10);

    const { password, ...user } = await this.userRepository.save(newUser);
    return user;
  }

  async updateMe(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await bcryptHash(password, 10);
    }
    return this.userRepository.update(id, updateUserDto);
  }

  findOneByLogin(login: string) {
    const options: FindOneOptions<User> = {
      select: { username: true, id: true, password: true, email: true },
      where: [{ username: login }, { email: login }],
    };
    return this.findOne(options);
  }

  findMe(id: number) {
    const options = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    };
    return this.findOne(options);
  }

  async findMeWishes(id: number) {
    const options = {
      select: {
        wishes: true,
      },
      where: { id },
      relations: {
        wishes: { offers: true },
      },
    };

    const { wishes } = await this.findOne(options);

    return wishes;
  }

  findByQuery(query: string) {
    const options: FindManyOptions<User> = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    };

    return this.findAll(options);
  }

  findUserByName(userName: string) {
    const options: FindOneOptions<User> = {
      where: { username: userName },
    };

    return this.findOne(options);
  }
}
