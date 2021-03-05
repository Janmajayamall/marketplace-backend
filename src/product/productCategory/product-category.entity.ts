import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductEntity } from '../product.entity';
import { ProductProductCategoryRelation } from './product-product-category-relation.entity';

@Entity('product-category')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToMany(
    () => ProductProductCategoryRelation,
    (relation) => relation.productCategory,
  )
  productRelations: ProductProductCategoryRelation[];
}
