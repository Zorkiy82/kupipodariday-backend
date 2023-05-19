import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

import { Length, IsUrl } from 'class-validator';
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

  @Column({ type: 'decimal', precision: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 2 })
  raised: number;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @Column({ type: 'integer' })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
