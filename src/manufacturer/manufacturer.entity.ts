import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('manufacturer')
export class ManufacturerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10 })
  phoneNumber: string;

  @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
