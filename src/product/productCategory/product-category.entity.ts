import { DataEntityStatus } from 'src/shared/helpers';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductEntity } from '../product.entity';

@Entity('product-category')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column('enum', {
    nullable: false,
    enum: DataEntityStatus,
    default: DataEntityStatus.ACTIVE,
  })
  status: DataEntityStatus;
}
