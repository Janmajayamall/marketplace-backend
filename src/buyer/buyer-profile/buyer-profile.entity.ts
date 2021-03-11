import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyerAddressEntity } from '../buyer-address/buyer-address.entity';
import { BuyerEntity } from '../buyer.entity';

@Entity('buyer-profile')
export class BuyerProfileEntity {
  @PrimaryColumn()
  id: number;

  @Column('varchar', { length: 10 })
  phoneNumber: string;

  @Column('text')
  firstNamePOC: string;

  @Column('text')
  lastNamePOC: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToOne(() => BuyerEntity, {
    primary: true,
  })
  @JoinColumn({ name: 'id' })
  buyer: BuyerEntity;
}
