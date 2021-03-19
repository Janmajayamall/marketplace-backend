import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('colour')
export class ColourEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('varchar', { length: 7 })
  hexValue: string;

  @CreateDateColumn()
  timestamp: Date;
}
