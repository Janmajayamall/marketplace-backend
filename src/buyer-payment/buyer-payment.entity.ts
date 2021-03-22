import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('buyer-payment')
export class BuyerPaymentEntity {
  @PrimaryColumn()
  orderId: number;

  @Column()
  buyerId: number;

  @Column('float')
  orderTotalPrice: number;

  @Column('float')
  totalTax: number;

  @Column('float')
  grandTotalPrice: number;

  @Column('text')
  dueDate: string;

  @Column('bool')
  paidStatus: boolean;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  lastModifiedTimestamp: Date;
}
