import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductResolver } from './product.resolver';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductVariationModule } from 'src/product-variation/product-variation.module';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductCategoryEntity } from './productCategory/product-category.entity';
import { ProductProductCategoryRelation } from './productCategory/product-product-category-relation.entity';
import { ProductImageEntity } from './productImage/product-image.entity';
import { ColourEntity } from './colour/colour.entity';
import { OrderCartEntity } from 'src/order-cart/order-cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariationEntity,
      ManufacturerEntity,
      ProductCategoryEntity,
      ProductProductCategoryRelation,
      ProductImageEntity,
      ColourEntity,
      OrderCartEntity,
    ]),
    ProductVariationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
