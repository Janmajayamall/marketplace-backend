import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'node:dns';
import { ProductCategoryType } from '../productCategory/dto/product-category.type';
import { ProductProductCategoryRelationType } from '../productCategory/dto/product-product-category-relation.type';
import { ProductImageType } from '../productImage/dto/product-image.type';
import { ProductVariationType } from './../../product-variation/dto/product-variation.type';
@ObjectType()
export class ProductType {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  clothComposition: string;

  @Field()
  width: number;

  @Field()
  gsm: number;

  @Field()
  pattern: string;

  @Field()
  referenceImageURL: string;

  @Field()
  minOrderSize: number;

  @Field({ nullable: true })
  referenceId: string;

  @Field()
  hsnCode: string;

  @Field()
  taxPercentage: number;

  @Field((type) => [ProductVariationType])
  variations: ProductVariationType[];

  @Field((type) => [ProductCategorySpecifierFixType])
  categories: ProductCategorySpecifierFixType[];

  @Field((type) => [ProductImageType])
  images: ProductImageType[];

  @Field()
  timestamp: string;
}

@ObjectType()
export class ProductCategorySpecifierFixType {
  @Field((type) => ProductCategoryType)
  category: ProductCategoryType;
}
