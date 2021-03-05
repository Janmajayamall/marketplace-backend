import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { OrderCartEntity } from 'src/order-cart/order-cart.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductVariationEntity } from './../product-variation/product-variation.entity';
import { ProductProductCategoryRelation } from './productCategory/product-product-category-relation.entity';
import { ProductImageEntity } from './productImage/product-image.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 300 })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  clothComposition: string;

  @Column('float')
  width: number;

  @Column('float')
  gsm: number;

  @Column('text')
  pattern: string;

  @Column('text')
  referenceImageURL: string;

  @Column('int')
  maxOrderSize: number;

  @Column('int')
  minOrderSize: number;

  @Column('text', { nullable: true })
  referenceId: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  manufacturerId: string;

  @OneToMany(
    () => ProductVariationEntity,
    (productVariation) => productVariation.product,
  )
  variations: ProductVariationEntity[];

  @ManyToOne(
    () => ManufacturerEntity,
    (manufacturerEntity) => manufacturerEntity.products,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: ManufacturerEntity;

  @OneToMany(
    () => ProductProductCategoryRelation,
    (relation) => relation.product,
  )
  productCategoryRelations: ProductProductCategoryRelation[];

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  productImages: ProductImageEntity[];

  @OneToMany(
    () => OrderCartEntity,
    (orderCartEntity) => orderCartEntity.product,
  )
  ordersInCart: OrderCartEntity[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
