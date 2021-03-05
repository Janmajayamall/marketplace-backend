import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from '../product.entity';
import { ProductCategoryEntity } from './product-category.entity';

@Entity('product-product-category-relation')
export class ProductProductCategoryRelation {
  @PrimaryColumn()
  productId: string;

  @PrimaryColumn()
  productCategoryId: number;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.productCategoryRelations,
    {
      primary: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(
    () => ProductCategoryEntity,
    (productCategoryEntity) => productCategoryEntity.productRelations,
    { primary: true, eager: true },
  )
  @JoinColumn({ name: 'productCategoryId' })
  productCategory: ProductCategoryEntity;
}
