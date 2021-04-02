import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductEntity } from 'src/product/product.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStage {
  NEW = 'new',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing',
  DELIVERED = 'delivered',
}

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ORDER RELATED
  @Column('int')
  orderQuantity: number;

  @Column('enum', {
    nullable: false,
    enum: OrderStage,
    default: OrderStage.NEW,
  })
  orderStage: OrderStage;

  @Column('float')
  orderTotalPrice: number;

  @Column('float')
  totalTax: number;

  @Column('float')
  grandTotalPrice: number;

  @Column('float', { nullable: true })
  deliveryCharges: number;

  @Column()
  buyerId: number;

  @Column()
  manufacturerId: number;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  lastModifiedTimestamp: Date;
  // ORDER RELATED END

  // PRODUCT DETAILS
  @Column()
  productId: number;

  @Column('text')
  productName: string;

  @Column('text')
  productDescription: string;

  @Column('text')
  productClothComposition: string;

  @Column('text')
  productWidth: string;

  @Column('text')
  productGsm: string;

  @Column('text')
  productPattern: string;

  @Column('int')
  productMinOrderSize: number;

  @Column('text', { nullable: true })
  productReferenceId: string;

  @Column('text')
  productHsnCode: string;

  @Column('float')
  productTaxPercentage: number;
  // PRODUCT DETAILS END

  // PRODUCT VARIATION DETAILS
  @Column()
  productVariationId: number;

  @Column('float')
  productVariationPrice: number;

  @Column('bool')
  productVariationInStock: Boolean;

  @Column('varchar', { length: 7 })
  productVariationColourHexCode: string;

  @Column('int')
  productVariationRChannel: number;

  @Column('int')
  productVariationGChannel: number;

  @Column('int')
  productVariationBChannel: number;

  // PRODUCT VARIATION DETAILS END
}
