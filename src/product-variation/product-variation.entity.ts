import { BuyerAddressEntity } from 'src/buyer/buyer-address/buyer-address.entity';
import { OrderCartEntity } from 'src/order-cart/order-cart.entity';
import { ColourEntity } from 'src/product/colour/colour.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './../product/product.entity';
import { roundToTwoPlaces } from './../shared/helpers';

@Entity('product-variation')
export class ProductVariationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('float')
  price: number;

  @Column('bool')
  inStock: Boolean;

  @Column()
  colourId: number;

  @Column()
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.variations, {
    eager: true,
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(
    () => ColourEntity,
    (colourEntity) => {
      colourEntity.productVariations;
    },
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'colourId' })
  colour: ColourEntity;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToMany(
    () => OrderCartEntity,
    (orderCartEntity) => orderCartEntity.productVariation,
  )
  ordersInCart: OrderCartEntity[];

  protected finalPrice: number;
  @AfterLoad()
  addCommissionToPrice() {
    this.finalPrice = roundToTwoPlaces(roundToTwoPlaces(this.price) * 1.1);
  }

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }

  getFinalPrice(): number {
    return this.finalPrice;
  }
}
