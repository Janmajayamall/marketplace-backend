import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerJwtGuard } from 'src/auth/guards/jwt.guards';
import { Repository } from 'typeorm';
import { BuyerPaymentEntity } from './buyer-payment.entity';

@Injectable()
export class BuyerPaymentService {
  private readonly logger = new Logger(BuyerPaymentService.name);

  constructor(
    @InjectRepository(BuyerPaymentEntity)
    private buyerPaymentRepository: Repository<BuyerPaymentEntity>,
  ) {}

  async getBuyerOrderPayments(buyerId: number): Promise<BuyerPaymentEntity[]> {
    return this.buyerPaymentRepository
      .createQueryBuilder('buyer-payments')
      .where('buyer-payments.buyerId = :buyerId', { buyerId: buyerId })
      .orderBy('buyer-payments.timestamp', 'DESC')
      .getMany();
  }
}
