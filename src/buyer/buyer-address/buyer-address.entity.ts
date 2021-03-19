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
import { BuyerEntity } from '../buyer.entity';

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

  @ManyToOne(() => BuyerEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'buyerId' })
  buyer: BuyerEntity;

  @CreateDateColumn()
  timestamp: Date;
}
