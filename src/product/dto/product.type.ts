import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ProductCategoryType } from '../productCategory/dto/product-category.type';
import { ProductProductCategoryRelationType } from '../productCategory/dto/product-product-category-relation.type';
import { ProductImageType } from '../productImage/dto/product-image.type';
import { ProductVariationType } from './../../product-variation/dto/product-variation.type';
@ObjectType()
export class ProductType {
  @Field()
  id: string;

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
  maxOrderSize: number;

  @Field()
  minOrderSize: number;

  @Field({ nullable: true })
  referenceId: string;

  @Field((type) => [ProductVariationType])
  variations: ProductVariationType[];

  @Field((type) => [ProductProductCategoryRelationType], { nullable: true })
  productCategoryRelations: ProductProductCategoryRelationType[];

  @Field((type) => [ProductImageType])
  productImages: ProductImageType[];
}
