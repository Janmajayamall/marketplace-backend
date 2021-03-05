import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductEntity } from 'src/product/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('order-cart')
export class OrderCartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // order specific details
  @Column('float')
  orderQuantitySize: number;

  @Column('float')
  orderTotalPrice: number;
  // end order specific details

  // buyer details
  @Column()
  buyerId: string;

  @ManyToOne(() => BuyerEntity, (buyerEntity) => buyerEntity.ordersInCart, {
    eager: true,
  })
  @JoinColumn({ name: 'buyerId' })
  buyer: BuyerEntity;
  // buyer details end

  // product variation details
  @Column('float')
  productVariationPrice: number;

  @Column('float')
  productVariationFinalPrice: number;

  @Column('bool')
  productVariationInStock: Boolean;

  @Column()
  productVariationColourId: number;

  @Column('text')
  productVariationColourHex: string;

  @Column('text')
  productVariationColourName: string;

  @Column()
  productVariationId: string;

  @ManyToOne(
    () => ProductVariationEntity,
    (productVariationEntity) => productVariationEntity.ordersInCart,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'productVariationId' })
  productVariation: ProductVariationEntity;
  // product variation details end

  // product details
  @Column('text')
  productName: string;

  @Column('text')
  productDescription: string;

  @Column('text')
  productClothComposition: string;

  @Column('float')
  productWidth: number;

  @Column('float')
  productGsm: number;

  @Column('text')
  productPattern: string;

  @Column('text')
  productReferenceImageURL: string;

  @Column('int')
  productMaxOrderSize: number;

  @Column('int')
  productMinOrderSize: number;

  @Column('text', { nullable: true })
  productReferenceId;

  @Column()
  productId: string;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.ordersInCart,
    { eager: true },
  )
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
  // product details end

  // manufacturer details
  @Column()
  manufacturerId: string;

  @ManyToOne(
    () => ManufacturerEntity,
    (manufacturerEntity) => manufacturerEntity.ordersInCart,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: ManufacturerEntity;
  // end manufacturer details

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
