import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '../product.entity';

@Entity('product-image')
export class ProductImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  publicId: string;

  @Column()
  productId: number;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
