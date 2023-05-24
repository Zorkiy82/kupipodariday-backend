import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @IsInt()
  @Min(1)
  itemId: number;
}
