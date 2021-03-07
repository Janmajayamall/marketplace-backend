import { OrderCartEntity } from 'src/order-cart/order-cart.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyerAddressEntity } from './buyer-address/buyer-address.entity';

@Entity('buyer')
export class BuyerEntity {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  firstNamePOC: string;

  @Column({ nullable: false })
  lastNamePOC: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  pincode: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToMany(() => OrderCartEntity, (orderCartEntity) => orderCartEntity.buyer)
  ordersInCart: OrderCartEntity[];

  @OneToMany(
    () => BuyerAddressEntity,
    (buyerAddressEntity) => {
      buyerAddressEntity.buyer;
    },
  )
  addresses: BuyerAddressEntity[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
