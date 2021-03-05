import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCartEntity } from 'src/order-cart/order-cart.entity';
import { BuyerEntity } from './buyer.entity';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerEntity, OrderCartEntity]),
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [BuyerService, BuyerResolver],
  exports: [BuyerService],
})
export class BuyerModule {}
