import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

import { Length, IsUrl, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ type: 'double precision', default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Offer, (offer) => offer.item)
  @JoinTable()
  offers: Offer[];

  @Column({ type: 'integer', default: 0 })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
