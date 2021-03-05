import { Module } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationEntity } from './product-variation.entity';
import { ProductEntity } from './../product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { OrderCartEntity } from 'src/order-cart/order-cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductVariationEntity,
      ProductEntity,
      OrderCartEntity,
    ]),
  ],
  providers: [ProductVariationService],
  exports: [ProductVariationService],
})
export class ProductVariationModule {}
