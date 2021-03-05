import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductVariationModule } from 'src/product-variation/product-variation.module';
import { ProductEntity } from 'src/product/product.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderCartEntity } from './order-cart.entity';
import { OrderCartResolver } from './order-cart.resolver';
import { OrderCartService } from './order-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderCartEntity,
      ProductEntity,
      ManufacturerEntity,
      ProductVariationEntity,
      BuyerEntity,
    ]),
    ProductModule,
    ProductVariationModule,
    ManufacturerModule,
  ],
  providers: [OrderCartService, OrderCartResolver],
})
export class OrderCartModule {}
