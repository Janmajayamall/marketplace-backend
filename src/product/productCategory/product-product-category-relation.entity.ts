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
  productId: number;

  @PrimaryColumn()
  productCategoryId: number;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => ProductEntity, {
    primary: true,
    eager: true,
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => ProductCategoryEntity, { primary: true, eager: true })
  @JoinColumn({ name: 'productCategoryId' })
  productCategory: ProductCategoryEntity;
}
