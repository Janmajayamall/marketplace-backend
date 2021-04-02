import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyerAddressEntity } from '../buyer-address/buyer-address.entity';
import { BuyerEntity } from '../buyer.entity';

@Entity('buyer-profile')
export class BuyerProfileEntity {
  @PrimaryColumn()
  buyerId: number;

  @Column('text')
  firstNamePOC: string;

  @Column('text')
  lastNamePOC: string;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  lastModifiedTimestamp: Date;

  @Column('text')
  address: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column('text')
  pincode: string;

  @Column('varchar')
  gstin: string;

  @Column('bool')
  gstVerified: Boolean;

  @OneToOne(() => BuyerEntity, {
    primary: true,
  })
  @JoinColumn({ name: 'buyerId' })
  buyer: BuyerEntity;
}
