import { Cipher } from 'node:crypto';
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
} from 'typeorm';

@Entity('phone-verification')
export class PhoneVerificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  verificationId: string;

  @Column('text')
  phoneNumber: string;

  @CreateDateColumn()
  timestamp: Date;
}
