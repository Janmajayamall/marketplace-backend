import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('request')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  details: string;

  @Column('text')
  phoneNumber: string;

  @Column('text', { default: 'NEW' })
  status: string;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  lastModifiedTimestamp: Date;
}
