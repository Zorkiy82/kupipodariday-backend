import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNumber } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish)
  item: Wish;

  @IsNumber()
  @Column({ type: 'double precision' })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
