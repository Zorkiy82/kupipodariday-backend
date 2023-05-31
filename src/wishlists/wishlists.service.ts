import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { TUserData } from 'src/types';

@Injectable()
export class WishlistsService {
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
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(user: TUserData, createWishlistDto: CreateWishlistDto) {
    const newWishList = this.wishlistRepository.create(createWishlistDto);
    const owner = await this.usersService.findMe(user.id);
    const wishes = await this.wishesService.findAllWishesByIdList(
      createWishlistDto.itemsId,
    );

    newWishList.owner = owner;
    newWishList.items = wishes;

    await this.wishlistRepository.save(newWishList);

    return newWishList;
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: TUserData,
  ) {
    const wishList = await this.findOne(id);
    if (wishList.owner.id !== user.id) {
      throw new ConflictException(`Редактировать можно только свою коллекцию`);
    }

    const { name, image, itemsId }: UpdateWishlistDto = updateWishlistDto;

    wishList.name = name ? name : wishList.name;
    wishList.image = image ? image : wishList.image;
    if (itemsId) {
      const wishes = await this.wishesService.findAllWishesByIdList(itemsId);
      wishList.items = wishes;
    }

    await this.wishlistRepository.save(wishList);

    return wishList;
  }

  async remove(id: number, user: TUserData) {
    const wishList = await this.findOne(id);

    if (wishList.owner.id !== user.id) {
      throw new ConflictException(`Удалить можно только свою коллекцию`);
    }

    await this.wishlistRepository.delete(id);

    return wishList;
  }
}
