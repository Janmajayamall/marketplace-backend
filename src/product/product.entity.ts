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
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('text')
  width: string;

  @Column('text')
  gsm: string;

  @Column('text')
  pattern: string;

  @Column('int')
  minOrderSize: number;

  @Column('text')
  referenceId: string;

  @Column('text')
  hsnCode: string;

  @Column('float')
  taxPercentage: number;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  lastModifiedTimestamp: Date;

  @Column()
  manufacturerId: number;

  @ManyToOne(() => ManufacturerEntity)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: ManufacturerEntity;

  @Column('text', { array: true })
  tags: string[];

  @Column('text')
  usage: string;

  @Column('enum', {
    nullable: false,
    enum: DataEntityStatus,
    default: DataEntityStatus.ACTIVE,
  })
  status: DataEntityStatus;
}
