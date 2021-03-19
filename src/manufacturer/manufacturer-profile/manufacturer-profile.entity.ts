import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ManufacturerEntity } from '../manufacturer.entity';

@Entity('manufacturer-profile')
export class ManufacturerProfileEntity {
  @PrimaryColumn()
  id: number;

  @Column('text')
  companyName: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 10 })
  phoneNumber: string;

  @Column('text')
  firstNamePOC: string;

  @Column('text')
  lastNamePOC: string;

  @OneToOne(() => ManufacturerEntity, { primary: true })
  @JoinColumn({ name: 'id' })
  manufacturer: ManufacturerEntity;

  @CreateDateColumn()
  timestamp: Date;
}
