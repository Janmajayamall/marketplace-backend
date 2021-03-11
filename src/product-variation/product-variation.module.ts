import { Module } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ProductVariationEntity } from './product-variation.entity';
import { ProductEntity } from './../product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariationEntity, ProductEntity])],
  providers: [ProductVariationService],
  exports: [ProductVariationService],
})
export class ProductVariationModule {}
