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
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './../product/product.entity';

@Entity('product-variation')
export class ProductVariationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  price: number;

  @Column('bool')
  inStock: Boolean;

  @Column('varchar', { length: 7 })
  colourHexCode: string;

  @Column('int')
  rChannel: number;

  @Column('int')
  gChannel: number;

  @Column('int')
  bChannel: number;

  @Column()
  productId: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
