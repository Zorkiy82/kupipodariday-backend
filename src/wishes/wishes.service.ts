import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsOrderValue,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  relationSettings = {
    owner: true,
    offers: {
      user: {
        wishes: true,
        offers: true,
        wishlists: {
          owner: true,
          items: true,
        },
      },
    },
  };
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(user: { id: number }, createWishDto: CreateWishDto) {
    const newWish = this.wishRepository.create(createWishDto);
    const owner = await this.usersService.findMe(user.id);
    newWish.owner = owner;
    await this.wishRepository.save(newWish);
    return {};
  }

  async copyWish(id: number, user: { id: number }) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }

    const { name, link, image, price, description }: CreateWishDto = wish;

    const newWish = await this.create(user, {
      name,
      link,
      image,
      price,
      description,
    });

    wish.copied += 1;

    this.wishRepository.save(wish);

    return newWish;
  }

  findAll(options: FindManyOptions<Wish>) {
    return this.wishRepository.find(options);
  }

  findOne(options: FindOneOptions<Wish>) {
    return this.wishRepository.findOne(options);
  }

  async findWishById(id: number) {
    const options = {
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
    };

    const wish = await this.findOne(options);

    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }

    return wish;
  }

  findLastWishes() {
    const orderValue: FindOptionsOrderValue = 'DESC';
    const options = {
      order: {
        createdAt: orderValue,
      },
      take: 40,
      relations: this.relationSettings,
    };
    return this.findAll(options);
  }

  findTopWishes() {
    const orderValue: FindOptionsOrderValue = 'DESC';
    const options = {
      order: {
        copied: orderValue,
      },
      take: 20,
      relations: this.relationSettings,
    };
    return this.findAll(options);
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update(id, updateWishDto);
  }

  updateFull(wish: Wish) {
    return this.wishRepository.save(wish);
  }

  async updateWishById(
    id: number,
    updateWishDto: UpdateWishDto,
    user: { id: number },
  ) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }
    if (wish.owner.id !== user.id) {
      throw new ConflictException(
        `Нельзя редактировать wish другого пользователя`,
      );
    }
    if (wish.offers.length && 'price' in updateWishDto) {
      throw new ConflictException(
        `Нельзя изменять стоимость, если уже есть желающие скинуться`,
      );
    }

    this.update(id, updateWishDto);

    return await this.update(id, updateWishDto);
  }

  async remove(id: number) {
    return await this.wishRepository.delete(id);
  }

  async deleteWishById(id: number, user: { id: number }) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }
    if (wish.owner.id !== user.id) {
      throw new ConflictException(`Нельзя удалять wish другого пользователя`);
    }
    await this.remove(id);

    return wish;
  }
}
