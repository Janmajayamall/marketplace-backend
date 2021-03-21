import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductEntity } from 'src/product/product.entity';
import { OrderEntity } from './order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      ProductVariationEntity,
      ProductEntity,
    ]),
    BuyerModule,
  ],
  controllers: [OrderController],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
