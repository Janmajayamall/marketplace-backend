import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyerProfileEntity } from '../buyer-profile/buyer-profile.entity';

@Entity('buyer-address')
export class BuyerAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  line1: string;

  @Column('varchar', { length: 7 })
  pincode: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column()
  buyerId: number;

  @ManyToOne(() => BuyerProfileEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'buyerId' })
  buyer: BuyerProfileEntity;

  @CreateDateColumn()
  timestamp: Date;
}
