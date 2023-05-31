import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() { user }: Request) {
    return this.wishesService.create(user as { id: number }, createWishDto);
  }

  @Get('/last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Post('/:id/copy')
  copyWish(@Param('id') id: number, @Req() { user }: Request) {
    return this.wishesService.copyWish(id, user as { id: number });
  }

  @Get('/:id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }
  @Patch('/:id')
  updateWishById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() { user }: Request,
  ) {
    return this.wishesService.updateWishById(
      id,
      updateWishDto,
      user as { id: number },
    );
  }

  @Delete('/:id')
  deleteWishById(@Param('id') id: number, @Req() { user }: Request) {
    return this.wishesService.deleteWishById(id, user as { id: number });
  }
}
