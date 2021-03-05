import { OrderCartEntity } from 'src/order-cart/order-cart.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './../product/product.entity';

@Entity('manufacturer')
export class ManufacturerEntity {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  firstNamePOC: string;

  @Column({ nullable: false })
  lastNamePOC: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.manufacturer)
  products: ProductEntity[];

  @OneToMany(
    () => OrderCartEntity,
    (orderCartEntity) => orderCartEntity.manufacturer,
  )
  ordersInCart: OrderCartEntity[];

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
