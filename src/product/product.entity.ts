import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { DataEntityStatus } from 'src/shared/helpers';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('int')
  minOrderSize: number;

  @Column('text', { nullable: true })
  referenceId: string;

  @Column('text')
  hsnCode: string;

  @Column('float')
  taxPercentage: number;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  manufacturerId: number;

  @ManyToOne(() => ManufacturerEntity)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: ManufacturerEntity;

  @Column('enum', {
    nullable: false,
    enum: DataEntityStatus,
    default: DataEntityStatus.ACTIVE,
  })
  status: DataEntityStatus;
}
