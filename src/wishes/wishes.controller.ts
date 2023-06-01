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
import { CastomRequest } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() { user }: CastomRequest) {
    return this.wishesService.create(user, createWishDto);
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
  copyWish(@Param('id') id: number, @Req() { user }: CastomRequest) {
    return this.wishesService.copyWish(id, user);
  }

  @Get('/:id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }
  @Patch('/:id')
  updateWishById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() { user }: CastomRequest,
  ) {
    return this.wishesService.updateWishById(id, updateWishDto, user);
  }

  @Delete('/:id')
  deleteWishById(@Param('id') id: number, @Req() { user }: CastomRequest) {
    return this.wishesService.deleteWishById(id, user);
  }
}
