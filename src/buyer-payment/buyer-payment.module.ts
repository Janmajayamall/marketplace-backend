import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerPaymentController } from './buyer-payment.controller';
import { BuyerPaymentEntity } from './buyer-payment.entity';
import { BuyerPaymentResolver } from './buyer-payment.resolver';
import { BuyerPaymentService } from './buyer-payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerPaymentEntity])],
  controllers: [BuyerPaymentController],
  providers: [BuyerPaymentService, BuyerPaymentResolver],
  exports: [BuyerPaymentService],
})
export class BuyerPaymentModule {}
