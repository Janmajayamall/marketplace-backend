import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { BuyerInput } from './buyer.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BuyerService {
  private readonly logger = new Logger(BuyerService.name, true);

  constructor(
    @InjectRepository(BuyerEntity)
    private buyerRepository: Repository<BuyerEntity>,
  ) {}

  async create(buyerInput: BuyerInput): Promise<BuyerEntity> {
    const passwordHash = await bcrypt.hash(buyerInput.password, 10);
    const buyerEntity = this.buyerRepository.create({
      ...buyerInput,
      passwordHash: passwordHash,
    });
    return this.buyerRepository.save(buyerEntity);
  }

  async findOneByNumber(phoneNumber: string): Promise<BuyerEntity> {
    return this.buyerRepository.findOne({ phoneNumber: phoneNumber });
  }

  async findOneById(id: string): Promise<BuyerEntity> {
    return this.buyerRepository.findOne({ id: id });
  }
}
