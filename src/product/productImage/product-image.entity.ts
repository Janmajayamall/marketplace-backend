import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '../product.entity';

@Entity('product-image')
export class ProductImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  publicId: string;

  @Column()
  productId: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.productImages,
  )
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
