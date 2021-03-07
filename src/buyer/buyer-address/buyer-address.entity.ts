import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyerEntity } from '../buyer.entity';

@Entity('buyer-address')
export class BuyerAddressEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  line1: string;

  @Column('varchar', { length: 7 })
  pincode: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column()
  buyerId: string;

  @ManyToOne(() => BuyerEntity, (buyerEntity) => buyerEntity.addresses, {
    eager: true,
  })
  @JoinColumn({ name: 'buyerId' })
  buyer: BuyerEntity;

  @Column('time without time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
